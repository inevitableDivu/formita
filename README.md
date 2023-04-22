# formita

> A basic react library that makes handling form easier. An alternative of formik

[![NPM](https://img.shields.io/npm/v/formita.svg)](https://www.npmjs.com/package/formita) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save formita
```

## Usage

```tsx
import { useFormita } from 'formita'
import React from 'react'
import Input from './Input'

export default function Example() {
	const { form, handleChange, handleOnSubmit, loading, disabled } =
		useFormita({
			email: {
				type: 'email',
				value: 'test@example.com'
			},
			password: {
				type: 'password'
			},
			userName: {
				type: 'text',
				value: 'User'
			},
			age: {
				type: 'number'
			}
		})
	return (
		<div>
			<Input
				type='name'
				value={form.userName.value}
				error={form.userName.error}
				onChange={handleChange('userName')}
			/>
			<Input
				type='number'
				value={form.age.value}
				error={form.age.error}
				onChange={handleChange('age')}
			/>
			<Input
				type='email'
				value={form.email.value}
				error={form.email.error}
				onChange={handleChange('email')}
			/>
			<Input
				type='password'
				value={form.password.value}
				error={form.password.error}
				onChange={handleChange('password')}
			/>

			<button
				disabled={disabled}
				onClick={handleOnSubmit(
					async (data) => {
						console.log(data)
					},
					(error) => {
						console.log(error)
					}
				)}
			>
				Submit
			</button>
		</div>
	)
}

const styles = StyleSheet.create({})
```

## License

MIT © [inevitableDivu](https://github.com/inevitableDivu)
