import emit from './emitter';

interface task {
  /** 指代一个资源 */
  danmu: any;
  /** 单个弹幕处理时间 */
  procedureTime: number;
  /** 弹幕在队列中的存在时间 */
  quitTime: number;
}

enum LINE_EVENT {
  RECEIVE_TASK = 'RECEIVE_TASK',
  LINE_FREE = 'LINE_FREE',
  TASK_OUT = 'TASK_OUT'
}

/** 队列状态 */
enum LINE_STATUS {
  BUSY,
  IDLE,
  EMPTY
}

/** 任务队列 */
export class WorkLine {
  private list: any[];
  public status: LINE_STATUS;
  private emitter;

  constructor() {
    this.list = [];
    this.status = LINE_STATUS.EMPTY;
    this.emitter = emit();
  }

  private emit(name: string, args?: any) {
    this.emitter.emit(name, args);
  }

  public on(name: string, handler: Function) {
    this.emitter.on(name, handler);
  }

  /** 队列执行任务 */
  public doJob(task: any) {
    this.list.push(task);
    this.status = LINE_STATUS.BUSY;
    this.emit(LINE_EVENT.RECEIVE_TASK);
  }

  /**
   * @description 通知可以接受资源：这是一个暴露给外部的方法，
   * 因为对workline来说并不清楚这个业务场景什么时候会完成，所以将状态变更的方法给到业务场景
   * */
  public readyToReceice() {
    this.status = LINE_STATUS.IDLE;
    this.emit(LINE_EVENT.LINE_FREE);
  }

  /**
   * @desciption 同上
   */
  public resourceOut(task: any) {
    const taskIndex = this.list.findIndex((v) => v === task);
    /** 未找到 一般是传错了 */
    if (taskIndex === -1) {
      return;
    }
    const [removedItem] = this.list.splice(taskIndex, 1);
    this.emit(LINE_EVENT.TASK_OUT, removedItem);
    this.status = this.list.length === 0 ? LINE_STATUS.IDLE : this.status;
  }
}

class ResourcePool {
  private pool: any[];
  private workline: WorkLine[];

  constructor() {
    this.pool = [];
    this.workline = [];
  }

  /** 设置任务队列数 */
  public setLineCount(count: number) {
    const currentNum = this.workline.length;
    const gap = count - currentNum;
    const absGap = Math.abs(gap);
    if (gap > 0) {
      for (let i = 0; i < absGap; i++) {
        this.workline.push(this.getWorkLine());
      }
    } else if (gap < 0) {
      for (let i = 0; i < absGap; i++) {
        this.workline.pop();
      }
    }
  }

  /** 获取任务队列对象 */
  private getWorkLine() {
    const line = new WorkLine();
    line.on(LINE_EVENT.LINE_FREE, () => {
      if (this.pool.length > 0) {
        /** 从库存中取任务 */
        line.doJob(this.pool.shift());
      }
    });
    return line;
  }

  /** 寻找队列: 空或者可用队列 */
  public fineLineByStatus(status: LINE_STATUS) {
    for (let i = 0; i < this.workline.length; i++) {
      const line = this.workline[i];
      if (line.status === status) {
        return line;
      }
    }
    return null;
  }

  /** 加入任务 */
  public addJob(task: any) {
    /** 优先找空闲的 */
    const line =
      this.fineLineByStatus(LINE_STATUS.IDLE) ||
      this.fineLineByStatus(LINE_STATUS.EMPTY);
    if (line) {
      line.doJob(task);
    } else {
      /** 所有队列忙，存到池子 */
      this.pool.push(task);
    }
  }

  /** 加入优先任务，队列 */
  public prioritizeJob(task: any) {
    const line =
      this.fineLineByStatus(LINE_STATUS.IDLE) ||
      this.fineLineByStatus(LINE_STATUS.EMPTY);
    if (line) {
      line.doJob(task);
    } else {
      /** 插队，排到最前面 */
      this.pool.unshift(task);
    }
  }
}
