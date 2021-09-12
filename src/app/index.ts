import '../assets/style/style.styl'
import VMasker from 'vanilla-masker'
import Axios from 'axios'
import Rellax from 'rellax'
import imageLoaded from 'imagesloaded'
import lottie from 'lottie-web'
import Loading from '../assets/animations/67908-duck.json'
import LoadingProductsAnimation from '../assets/animations/67856-men-1.json'
import anime from 'animejs'
import emailvalidator from 'email-validator'
import { cpf as cpfvalidator } from 'cpf-cnpj-validator'

const initProducts = async (link = '/frontend-intern-challenge-api.iurykrieger.vercel.app/products?page=1') => {
    const { data: { nextPage, products } } = await Axios.get(`https:/${link}`)
    const productsContainer = document.getElementById('products')
    
    products.forEach(({
        id,
        image,
        description,
        name,
        oldPrice,
        price,
        installments: {
            count: installments,
            value: installmentsPrice
        }
    }: any) => {
        const template: Node | undefined = document.getElementById('template')?.cloneNode(true)
        const formCurrency = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2
        })
        if (!template) return;
        (template as HTMLElement).id = `product-${id}`
        let code = (template as HTMLElement).innerHTML
        code = code
            .split('{name}').join(name)
            .split('{description}').join(description)
            .split('{image}').join(image)
            .split('data-src').join('src')
            .split('{old_price}').join(formCurrency.format(oldPrice))
            .split('{price}').join(formCurrency.format(price))
            .split('{installments_price}').join(formCurrency.format(installmentsPrice))
            .split('{installments}').join(installments);

        (template as HTMLElement).innerHTML = code
        productsContainer?.appendChild(template)
    })
    return `/${nextPage}`
} 

const animation = lottie.loadAnimation({
    container: (document.getElementById('loadingAnimation') as Element),
    loop: true,
    renderer: 'svg',
    animationData: Loading
})

const LoadingProducts = () => {
    const animation = lottie.loadAnimation({
        container: (document.getElementById('loadingProducts') as Element),
        loop: true,
        renderer: 'svg',
        animationData: LoadingProductsAnimation
    })

    return animation
}

interface controlsForm {
    name: string
    validator?: (value: any) => [boolean, string]
    isRequired: boolean
}


class FormValidator {
    Form: HTMLFormElement
    controls: controlsForm[]
    Errors: Map<string, string> = new Map()
    constructor (form: HTMLFormElement, controls: controlsForm[]) {
        this.Form = form
        this.controls = controls
    }

    get values() {
        const obj: any = {}
        this.controls.forEach(({
            name,
        }: controlsForm) => {
            const inputControl = this.Form.querySelector(`[name="${name}"]:not([type='radio'])`)
            const inputControlRadio = this.Form.querySelectorAll(`[name="${name}"][type='radio']`)

            if (inputControl) {
                obj[name] = (inputControl as HTMLInputElement).value
            } else if (inputControlRadio.length) {
                inputControlRadio.forEach((el: any) => {
                    if (el.checked) {
                        obj[name] = (el as HTMLInputElement).value
                    }
                })
            }
        })

        return obj
    }

    setError(controlName: string, errorMessage: string) {
        this.Errors.set(controlName, errorMessage)
        const ErrorLabel = this.Form.querySelector(`[data-error="${controlName}"]`)
        if (ErrorLabel) {
            (ErrorLabel as any).classList.remove('hide');
            (ErrorLabel as any).innerText = errorMessage
        }
    }

    clearError(controlName: string) {
        this.Errors.delete(controlName)
        const ErrorLabel = this.Form.querySelector(`[data-error="${controlName}"]`)
        if (ErrorLabel) {
            (ErrorLabel as any).classList.add('hide');
            (ErrorLabel as any).innerText = ''
        }
    }

    check() {
        this.controls.forEach(({
            isRequired,
            name,
            validator
        }: controlsForm) => {
            const inputControl = this.Form.querySelector(`[name="${name}"]:not([type='radio'])`)
            const inputControlRadio = this.Form.querySelectorAll(`[name="${name}"][type='radio']`)
            if (inputControl && (isRequired && !((inputControl as HTMLInputElement).value))) {
                this.setError(name, 'Este campo é obrigatório!')
            } else if (inputControlRadio.length && isRequired) {
                const checkeds = Array.from(inputControlRadio).filter((input: any) => input.checked)
                if (!checkeds.length) this.setError(name, 'Este campo é obrigatório!')
                if (checkeds.length) this.clearError(name)
            } else if (validator) {
                const value = (inputControl as HTMLInputElement).value
                const [error, message] = validator(value)
                if (!error) {
                    this.setError(name, message)
                } else {
                    this.clearError(name)
                }
            } else {
                this.clearError(name)
            }
        })
    }
}

imageLoaded((document.querySelector('body') as any), () => {    
    window.addEventListener('load', async () => {
        const formOne = (document.getElementById('formOne') as HTMLFormElement)
        const formTwo = (document.getElementById('formTwo') as HTMLFormElement)
        const inputMask =  document.getElementById('cpf')
        const nextPageButton = document.getElementById('next')
        const FormOneController = new FormValidator(formOne, [
            {
                name: 'name',
                isRequired: true
            },
            {
                name: 'email',
                isRequired: true,
                validator(email: string) {
                    const check = emailvalidator.validate(email)
                    if (!check) {
                        return [check, `Email ${email} é inválido`]
                    }
                    return [check, `Email ${email} é válido`]
                }
            },
            {
                name: 'cpf',
                isRequired: true,
                validator(cpf: string) {
                    const check = cpfvalidator.isValid(cpf)
                    if (!check) {
                        return [check, `CPF ${cpf} é inválido`]
                    }
                    return [check, `CPF ${cpf} é válido`]
                }
            },
            {
                name: 'genrer',
                isRequired: true
            }
        ])

        const FormOneControllerTwo = new FormValidator(formTwo, [
            {
                name: 'name',
                isRequired: true
            },
            {
                name: 'email',
                isRequired: true,
                validator(email: string) {
                    const check = emailvalidator.validate(email)
                    if (!check) {
                        return [check, `Email ${email} é inválido`]
                    }
                    return [check, `Email ${email} é válido`]
                }
            },
        ])
        const parallaxTargets = '.parallax'
        let nextPage = ''
        inputMask && VMasker(inputMask).maskPattern('999.999.999-99')
        new Rellax(parallaxTargets)
        nextPage = await initProducts()
        anime({
            targets: '#loadingPage',
            opacity: [1, 0],
            duration: 1000,
            easing: 'linear',
            complete() {
                animation.destroy();
                (document.getElementById('loadingPage') as HTMLElement).style.display = 'none'
            }
        })

        formOne.addEventListener('submit', (e: Event) => {
            e.preventDefault()
            FormOneController.check()
            if (FormOneController.Errors.size) return
            console.log(FormOneController.values)
        })

        formTwo.addEventListener('submit', (e: Event) => {
            e.preventDefault()
            FormOneControllerTwo.check()
            if (FormOneControllerTwo.Errors.size) return
            console.log(FormOneControllerTwo.values)
        })
        
        nextPageButton?.addEventListener('click', async () => {
            const button = (document.getElementById('loadingProductsButton') as HTMLButtonElement)
            const loading = (document.getElementById('loadingProductsBox') as HTMLButtonElement)
            button.style.display = 'none'
            loading.classList.remove('hide')
            const animation = LoadingProducts()
            nextPage = await initProducts(nextPage)
            animation.destroy()
            loading.classList.add('hide')
            button.style.display = 'block'
        })
    })
})

