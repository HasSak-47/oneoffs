"use strict";
class Result {
    constructor(inner) {
        this.inner = inner;
    }
    static ok(value) {
        return new Result({ data: value, error: null });
    }
    static err(value) {
        return new Result({ data: null, error: value });
    }
}
function try_catch(f, ...args) {
    try {
        return Result.ok(f(...args));
    }
    catch (error) {
        return Result.err(error);
    }
}
