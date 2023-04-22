export declare type IError = {
    message: string;
} | null;
export declare type IUserInputParams = Record<string, {
    type: 'email' | 'text' | 'password';
    value?: unknown;
} | {
    type: 'number';
    value?: number;
    limit: number;
}>;
export declare type IFormDataTypes = 'email' | 'text' | 'password' | 'number';
export declare type INumberForm = {
    value: string;
    error: IError;
    limit: number;
    type: 'number';
};
export declare type IOtherType<T> = {
    type: 'email' | 'text' | 'password';
    value: unknown extends T ? string : T;
    error: IError;
    limit: number;
};
export declare type IUserInputForm<T extends IUserInputParams> = {
    [P in keyof T]: INumberForm | IOtherType<T[P]['value']>;
};
export declare function validate(value: string, type: 'email' | 'password'): IError;
export declare function useFormita<T extends IUserInputParams>(params: T): {
    /**
     * The function handleChange is a TypeScript function that validates user input for a form and updates
     * the form state accordingly.
     * @param {P} target - A key of the generic type T, which represents the field in the form that is
     * being changed.
     * @returns A function that takes in a parameter `text` and performs validation based on the type of
     * the `formTarget` input field. It then updates the `form` state with the new `text` value and any
     * validation error. Finally, it returns the validation error.
     */
    handleChange: <P extends keyof T>(target: P) => (text: string | (unknown extends T[P]['value'] ? string : T[P]['value'])) => IError;
    form: IUserInputForm<T>;
    /**
     * This is a TypeScript function that handles form submission with error handling and loading state
     * management.
     * @param cb - A callback function that takes in the user input form data as an argument and performs
     * some action with it.
     * @param [errorCallback] - The errorCallback parameter is an optional function that takes an error
     * object as its argument and handles any errors that occur during the form submission process.
     * @param [complete] - The `complete` parameter is an optional callback function that will be called
     * after the `cb` function has been executed and the `try` block has been completed, regardless of
     * whether there was an error or not. It can be used to perform any cleanup or additional actions
     * after the form submission is complete
     * @returns A function that handles form submission and calls the provided callback function with the
     * form data if there are no errors. It also handles errors and calls the provided error callback
     * function if there is an error. Additionally, it sets the loading state to true during form
     * submission and sets it back to false after completion.
     */
    handleOnSubmit: (cb: (data: IUserInputForm<T>) => void, errorCallback?: ((error: IError) => void) | undefined, complete?: (() => void) | undefined) => () => Promise<void>;
    loading: boolean;
    disabled: boolean;
};
