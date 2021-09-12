import '../assets/style/style.styl'
import VMasker from 'vanilla-masker'
import Axios from 'axios'
import Rellax from 'rellax'

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
    return nextPage
} 

window.addEventListener('load', async () => {
    let nextPage = ''
    const inputMask =  document.getElementById('cpf')
    const nextPageButton = document.getElementById('next')
    const parallaxTargets = '.parallax'
    inputMask && VMasker(inputMask).maskPattern('999.999.999-99')
    new Rellax(parallaxTargets)
    nextPage = await initProducts()
    nextPageButton?.addEventListener('click', async () => {
        nextPage = await initProducts(nextPage)
    })
})