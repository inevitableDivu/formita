import { useCallback, useEffect, useMemo, useState } from 'react'

export type IError = {
	message: string
} | null

export type IUserInputParams = Record<
	string,
	| {
			type: 'email' | 'text' | 'password'
			value?: unknown
	  }
	| {
			type: 'number'
			value?: number
			limit: number
	  }
>

export type IFormDataTypes = 'email' | 'text' | 'password' | 'number'

export type INumberForm = {
	value: string
	error: IError
	limit: number
	type: 'number'
}

export type IOtherType<T> = {
	type: 'email' | 'text' | 'password'
	value: unknown extends T ? string : T
	error: IError
	limit: number
}

export type IUserInputForm<T extends IUserInputParams> = {
	[P in keyof T]: INumberForm | IOtherType<T[P]['value']>
}

export function validate(value: string, type: 'email' | 'password'): IError

/**
 * This function validates an input value as either an email or password and returns an error message
 * if the input is invalid.
 * @param {string} value - The input value that needs to be validated.
 * @param {'email' | 'password'} type - The type parameter is a string literal type that can only have
 * two possible values: 'email' or 'password'. It is used to determine the type of validation to
 * perform on the value parameter.
 * @returns an object of type `IError` which contains a `message` property. The value of the `message`
 * property depends on the validation rules for the input `value` and `type`. If the input is valid,
 * the function returns `null`.
 */
export function validate(value: string, type: 'email' | 'password'): IError {
	if (value.length === 0)
		return {
			message: 'Input field cannot be empty'
		}

	if (type === 'email') {
		const check = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,5}$/g
		if (check.test(value)) return null
		else
			return {
				message: 'Invalid e-mail entered'
			}
	}

	if (type === 'password') {
		if (value.length < 6)
			return {
				message: 'Password must contain atleat 6 characters'
			}
		else null
	}

	return null
}

export function useFormita<T extends IUserInputParams>(
	params: T
): {
	/**
	 * The function handleChange is a TypeScript function that validates user input for a form and updates
	 * the form state accordingly.
	 * @param {P} target - A key of the generic type T, which represents the field in the form that is
	 * being changed.
	 * @returns A function that takes in a parameter `text` and performs validation based on the type of
	 * the `formTarget` input field. It then updates the `form` state with the new `text` value and any
	 * validation error. Finally, it returns the validation error.
	 */
	handleChange: <P extends keyof T>(
		target: P
	) => (
		text: string | (unknown extends T[P]['value'] ? string : T[P]['value'])
	) => IError
	form: IUserInputForm<T>
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
	handleOnSubmit: (
		cb: (data: IUserInputForm<T>) => void,
		errorCallback?: ((error: IError) => void) | undefined,
		complete?: (() => void) | undefined
	) => () => Promise<void>
	loading: boolean
	disabled: boolean
}

/**
 * This is a TypeScript function that creates a form with input fields and handles form submission with
 * validation and error handling.
 * @param {T} params - The `params` parameter is an object that contains the initial values and
 * configurations for the form inputs. It is a generic type `T` that extends `IUserInputParams`, which
 * is an interface that defines the properties of each input field (e.g. `value`, `type`, `limit`
 * @returns The `useFormita` hook returns an object with the following properties: `handleChange`,
 * `form`, `handleOnSubmit`, `loading`, and `disabled`.
 */
export function useFormita<T extends IUserInputParams>(params: T) {
	const [loading, setLoading] = useState(false)
	const [disabled, setDisabled] = useState(false)
	const formData = useMemo(() => {
		const obj: T = { ...params }
		let newObj: object = {}
		Object.keys(obj).map((key) => {
			let index = key as keyof T
			let objChild = obj[index]
			newObj = {
				...(newObj ?? ({} as IUserInputForm<T>)),
				[index]: {
					...obj[index],
					value: objChild.value ?? '',
					type: objChild.type
				}
			}
		})

		return newObj as IUserInputForm<T>
	}, [])
	const [form, setForm] = useState<IUserInputForm<T>>(formData)

	/**
	 * The function handleChange is a TypeScript function that validates user input for a form and updates
	 * the form state accordingly.
	 * @param {P} target - A key of the generic type T, which represents the field in the form that is
	 * being changed.
	 * @returns A function that takes in a parameter `text` and performs validation based on the type of
	 * the `formTarget` input field. It then updates the `form` state with the new `text` value and any
	 * validation error. Finally, it returns the validation error.
	 */
	const handleChange = useCallback(
		<P extends keyof T>(target: P) => {
			const formTarget = form[target] as IUserInputForm<T>[P]
			const limit = formTarget.type === 'number' ? formTarget.limit : 1

			return (text: typeof formTarget.value) => {
				let error: IError = null
				if (
					formTarget.type === 'email' ||
					formTarget.type === 'password'
				) {
					error = validate(String(text), formTarget.type)
				}

				if (formTarget.type === 'text') {
					error =
						String(text).length < 1
							? { message: 'Input field cannot be empty!' }
							: null
				}

				if (formTarget.type === 'number') {
					if (text === '') {
						error = {
							message: 'Input field cannot be empty!'
						}
					} else if (isNaN(Number(text))) {
						error = {
							message: 'Invalid data provided!'
						}
					} else if (String(text).length > limit) {
						error = {
							message: 'Invalid length of characters!'
						}
					}
				}

				setForm((data) => ({
					...data,
					[target]: { ...data[target], value: text, error }
				}))

				return error
			}
		},
		[form]
	)

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
	const handleOnSubmit = useCallback(
		(
			cb: (data: IUserInputForm<T>) => void,
			errorCallback?: (error: IError) => void,
			complete?: () => void
		) => {
			return async () => {
				try {
					setLoading(true)
					const error = Object.keys(form).find((item) =>
						Boolean(form[item as keyof T].error)
					) as keyof T

					const errorIndex = Object.keys(form).find(
						(item) => String(form[item as keyof T].value).length < 1
					)

					if (error) {
						console.log(error)
						return
					}

					if (errorIndex) {
						setForm((old) => ({
							...old,
							[errorIndex]: {
								...old[errorIndex],
								error: {
									message: 'Input field cannot be empty!'
								}
							}
						}))
						return
					}

					await cb(form)
				} catch (error) {
					const message =
						typeof error?.response?.data === 'string'
							? error.response.data
							: typeof error?.response?.data === 'object'
							? error.response.data.message
							: error.message
					errorCallback?.({
						message
					})
				} finally {
					complete?.()
					setLoading(false)
				}
			}
		},
		[form]
	)

	useEffect(() => {
		const check = Object.keys(form).find((item) => {
			return Boolean(form[item as keyof T].error)
		})

		if (check) {
			setDisabled(true)
		} else {
			setDisabled(false)
		}
	}, [form])

	return { handleChange, form, handleOnSubmit, loading, disabled }
}
