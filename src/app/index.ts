import '../assets/style/style.styl'
import VMasker from 'vanilla-masker'
import Axios from 'axios'
import Rellax from 'rellax'
import imageLoaded from 'imagesloaded'
import lottie from 'lottie-web'
import Loading from '../assets/animations/67908-duck.json'
import LoadingProductsAnimation from '../assets/animations/67856-men-1.json'
import anime from 'animejs'

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

imageLoaded((document.querySelector('body') as any), () => {    
    window.addEventListener('load', async () => {
        let nextPage = ''
        const inputMask =  document.getElementById('cpf')
        const nextPageButton = document.getElementById('next')
        const parallaxTargets = '.parallax'
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

