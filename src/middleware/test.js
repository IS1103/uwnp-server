
class A {
  static async test() {
    // No unhandled rejection!
    await Promise.reject(new Error('test'));
    // throw new Error();
  }
}


// A.test();
// 输出：
// (node:54358) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 3): Error: test
// (node:54358) [DEP0018] DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code.
// A.test().catch(error => console.log(error.message));
// 输出：
// test

try {
  let ss = A.test();
  if (ss instanceof Promise) {
    console.log('is promis')
  }
} catch (error) {
  console.log(error.message)
}