export default function findMaxOrder(arr: Array<{ order: number }>) {
  let biggestOrder = arr.length ? arr[0].order : 0;
  for (let i = 1; i < arr.length; i++) {
    if (arr[i].order > biggestOrder) biggestOrder = arr[i].order;
  }
  return biggestOrder;
}
