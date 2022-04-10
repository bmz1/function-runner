import { Runner } from "..";
import { expect } from "chai";

describe("Runner", () => {
  it("should run a function", async () => {
    const context: { foo?: string } = {};
    const middleware = (context) => {
      context.foo = "bar";
    };
    const runner = Runner();
    runner.use(middleware);

    await runner.handle(context);

    expect(context.foo).to.equal("bar");
  });

  it("should not run the function, if next is not called", async () => {
    const context: { foo?: string; bar?: string } = {};

    const middleware1 = (context) => {
      context.foo = "bar";
    };

    const middleware2 = (context) => {
      context.bar = "foo";
    };
    const runner = Runner();
    runner.use(middleware1, middleware2);

    await runner.handle(context);

    expect(context.foo).to.equal("bar");
    expect(context.bar).to.equal(undefined);
  });

  it("should run multiple functions", async () => {
    const context: { foo?: string; bar?: number; baz?: boolean } = {};

    const middleware1 = (context, next) => {
      context.foo = "bar";
      next(context);
    };
    const middleware2 = (context, next) => {
      context.bar = 1;
      next(context);
    };
    const middleware3 = (context) => {
      context.baz = true;
    };

    const runner = Runner();
    runner.use(middleware1);
    runner.use(middleware2);
    runner.use(middleware3);

    await runner.handle(context);

    expect(context.foo).to.equal("bar");
    expect(context.bar).to.equal(1);
    expect(context.baz).to.equal(true);
  });
});
