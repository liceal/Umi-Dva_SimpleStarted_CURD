/*
  默认导出interface，并且其他地方可以直接使用
*/

/**用户单一数据格式 */
interface SingleUserType {
  id: number;
  name: string;
  email: string;
  create_time: string;
  update_time: string;
  status: number;
}

interface FormValues {
  [name: string]: any;
}
