import {
  type Workspace,
  type TaskList,
  type Card,
} from "../../interfaces/Workspace";
export default function findMaxOrder(arr: Array<Workspace | TaskList | Card>) {
  let biggestOrder = arr.length ? arr[0].order : 0;
  for (let i = 1; i < arr.length; i++) {
    if (arr[i].order > biggestOrder) biggestOrder = arr[i].order;
  }
  return biggestOrder;
}
