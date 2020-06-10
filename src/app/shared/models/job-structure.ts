export interface JobStructure {
  name: string;
  className: string;
  group: string;
  description: string;
  cronExpression: string;
  state: string;
  startTime: number;
  endTime: number;
  nextFireTime: number;
  previousFireTime: number;
}
