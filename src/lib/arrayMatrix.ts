export default class matrix {
  public static indentity = (size) => {
    const matrix = new Array(size).fill(0).map(() => new Array(size).fill(0));
    for (let i = 0; i < size; i++) {
      matrix[i][i] = 1;
    }
    return matrix;
  };

  public static empty = (rows: number, cols: number) => {
    const matrix: number[][] = [];
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (!matrix[i]) matrix.push([]);
        matrix[i].push(0);
      }
    }
    console.log({ matrix });
    return matrix;
  };

  public static multiply = (
    m1: number[][] | number[],
    m2: number[][] | number[]
  ): number[][] | number[] => {
    let a = m1 as number[][];
    let b = m2 as number[][];
    if (typeof m1[0] === "number") {
      // @ts-ignore
      a = [m1];
    }
    if (typeof m2[0] === "number") {
      // @ts-ignore
      b = m2.map((x) => [x]);
    }

    const c = matrix.empty(a.length, b[0].length);

    for (let i = 0; i < a.length; i++) {
      for (let j = 0; j < b[0].length; j++) {
        let sum = 0;
        for (let k = 0; k < a[0].length; k++) {
          sum += a[i][k] * b[k][j];
        }
        c[i][j] = sum;
      }
    }
    return c;
  };
}
