export class SingletonTest
{
    private static _instance: SingletonTest;

    private _value: number;

    public set value(val: number) {
        this._value = val;
    }

    public get value() {
        return this._value;
    }

    private constructor()
    {
        this._value = 0;
    }

    public static getInstance()
    {
        // Do you need arguments? Make it a regular static method instead.
        return this._instance || (this._instance = new this());
    }
}