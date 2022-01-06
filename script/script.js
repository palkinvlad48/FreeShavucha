const customer = document.getElementById('customer')
const freelancer = document.getElementById('freelancer')
const blockCustomer = document.getElementById('block-customer')
const blockFreelancer = document.getElementById('block-freelancer')
const blockChoice = document.getElementById('block-choice')
const btnExit = document.getElementById('btn-exit')
const formCustomer = document.getElementById('form-customer')
const ordersTable = document.getElementById('orders')
const modalOrder = document.getElementById('order_read')
const modalOrderActive = document.getElementById('order_active')
const headTable = document.getElementById('headTable')
// отправить заявку:
const btnBlock = document.querySelector('.btn-block')
const radioWraper = document.querySelector('.justify-content-center')
//

const orders = JSON.parse(localStorage.getItem('freeOrders')) || []
//
const toStorage = () => {
  localStorage.setItem('freeOrders', JSON.stringify(orders))
}
// вар-т Лескина (из интернета) склонение числительных
const declOfNum = (number, titles) => number + ' ' + titles[(number % 100 > 4 && number % 100 < 20) ?
  2 : [2, 0, 1, 1, 1, 2][(number % 10 < 5) ? number % 10 : 5]]
// вар-т Лескина
const calcDeadline = (date) => {
  const deadline = new Date(date)
  const toDay = Date.now()

  const remaining = (deadline - toDay) / 1000 / 60 / 60
  let itog = declOfNum(Math.floor(remaining), ['час', 'часа', 'часов'])

  if (remaining < 0) { itog = 'Заказ просрочен' }
  else {
    if (remaining / 24 > 2) {
      itog = declOfNum(Math.floor(remaining / 24), ['день', 'дня', 'дней'])
    }
  }
  return itog
}
/* дом.задание
const calcDeadline = (num) => {
  console.log('num:', num)
  const newDate = new Date
  let suffix = []
  let suffixD = [' день', ' дня', ' дней']
  let suffixH = [' час', ' часа', ' часов']
  
  const deadline = new Date(num)
  const toDay = Date.now()
  const del = deadline.getTime() - toDay 
  const remaining = del / 1000 / 60 / 60 / 24
  console.log('deadDay', deadline)
  let deltaDay = 0
  if (remaining > 1) {
    deltaDay = Math.floor(remaining)
    suffix = suffixD
  } else {
    deltaDay = Math.floor(remaining * 24)
    suffix = suffixH
  }
  console.log('del:', deltaDay)

  console.log('newDate:', newDate)
  console.log('remaining:', remaining)
  let dayStr = ''

  let index = 0
  console.log('delta-day:', deltaDay % 10)
  if (deltaDay > 10 && deltaDay < 21) { index = 2 }
  else if (deltaDay % 10 > 1 && deltaDay % 10 < 5) { index = 1 }
  else if (deltaDay % 10 > 4 && deltaDay % 10 < 10) { index = 2 }
  if (deltaDay < 0) { dayStr = 'Заказ просрочен' }
  else { dayStr = deltaDay + suffix[index] }

  return dayStr
}
/* */
const renderOrders = () => {

  ordersTable.innerHTML = ''

  orders.forEach((order, i) => {
    ordersTable.innerHTML += `
      <tr class="order ${order.active ? 'taken' : ''}" 
        data-number-order="${i}">
	    	<td>${i + 1}</td>
	    	<td>${order.title}</td>
	    	<td class="${order.currency}"></td>
	    	<td>${order.deadline}</td>
	    </tr>
    `
  })
}
//
function openModal(numberOrder) {
  const order = orders[numberOrder]
  const modal = order.active ? modalOrderActive : modalOrder
  modal.id = numberOrder

  const firstNameBlock = modal.querySelector('.firstName'),
    titleBlock = modal.querySelector('.modal-title'),
    emailBlock = modal.querySelector('.email'),
    descriptionBlock = modal.querySelector('.description'),
    deadlineBlock = modal.querySelector('.deadline'),
    currencyBlock = modal.querySelector('.currency_img'),
    countBlock = modal.querySelector('.count'),
    phoneBlock = modal.querySelector('.phone');

  const handlerModal = (ev) => {
    const target = ev.target
    const modal = target.closest('.order-modal')
    const order = orders[modal.id]

    const baseAction = () => {
      modal.style.display = 'none'
      toStorage()
      renderOrders()
    }

    if (target.closest('.close') || target === modal) {
      modal.style.display = 'none'
    }

    if (target.classList.contains('get-order')) {
      order.active = true
      baseAction()
    }

    if (target.id === 'capitulation') {
      order.active = false
      baseAction()
    }

    if (target.id === 'ready') {
      console.log(orders.indexOf(order))
      orders.splice(orders.indexOf(order), 1)
      baseAction()
    }

  }

  const { title, firstName, email, phone, description, amount, currency, deadline, active } = order
  //console.log('email', email)
  firstNameBlock.textContent = firstName
  titleBlock.textContent = title
  emailBlock.href = 'mailto:' + email
  emailBlock.textContent = email
  descriptionBlock.textContent = description
  deadlineBlock.textContent = calcDeadline(deadline) //
  currencyBlock.className = 'currency_img'
  currencyBlock.classList.add(currency)
  countBlock.textContent = amount
  phoneBlock ? phoneBlock.href = 'tel:' + phone : ''
  // или
  //phoneBlock && phoneBlock.href = 'tel:' + phone
  modal.style.display = 'flex'

  modal.addEventListener('click', handlerModal) //.bind(null, numberOrder))

}

const sortOrder = (arr, property) => {
  arr.sort((a, b) => a[property] > b[property] ? 1 : -1)
}

headTable.addEventListener('click', (ev) => {
  const target = ev.target

  if (target.classList.contains('head-sort')) {
    if (target.id === 'taskSort') {
      sortOrder(orders, 'title')
    }

    if (target.id === 'currencySort') {
      sortOrder(orders, 'currency')
    }

    if (target.id === 'deadlineSort') {
      sortOrder(orders, 'deadline')
    }
    toStorage()
    renderOrders()
  }
})

ordersTable.addEventListener('click', (ev) => {
  const target = ev.target
  const targetOrder = target.closest('.order')
  if (targetOrder) {
    openModal(targetOrder.dataset.numberOrder)
  }

})

customer.addEventListener('click', () => {
  blockCustomer.style.display = 'block'
  blockChoice.style.display = 'none'
  btnExit.style.display = 'block'
})

freelancer.addEventListener('click', () => {
  blockChoice.style.display = 'none'
  renderOrders()
  blockFreelancer.style.display = 'block'
  btnExit.style.display = 'block'
})

btnExit.addEventListener('click', () => {
  btnExit.style.display = 'none'
  blockFreelancer.style.display = 'none'
  blockCustomer.style.display = 'none'
  blockChoice.style.display = 'block'
})

let idPict = '' // валюта

formCustomer.addEventListener('click', (ev) => {
  ev.preventDefault()
  const target = ev.target
  const obj = {};
  /* 1-й вар-т
  formCustomer.elements - псевдомассив, коллекция - для нее нет метода forEach
  for (const elem of formCustomer.elements) {
  /* 2-й вар-т 
  //Array.from(formCustomer.elements).forEach((elem) или  [...formCustomer.elements]
    [...formCustomer.elements].forEach((elem) => {
      if ((elem.tagName === 'INPUT' && elem.type !== 'radio') ||
        (elem.type === 'radio' && elem.checked) ||
        (elem.tagName === 'TEXTAREA')) {
  /* */
  /* 3-й вар-т */
  const elements = [...formCustomer.elements]
    .filter((elem) => (elem.tagName === 'INPUT' && elem.type !== 'radio') ||
      (elem.type === 'radio' && elem.id === idPict) ||
      (elem.tagName === 'TEXTAREA'))

  elements.forEach((elem) => {
    obj[elem.name] = elem.value

  })

  if (target.classList.contains('img__radio')) { //currency__radio')) {
    const dataId = target.dataset.radio
    idPict = dataId
    //target.checked = true //setAttribute('checked', true)
    const input = document.getElementById(dataId)
    //input.checked = true
    console.log('radio', dataId)
  }
  if (target.classList.contains('btn-block')) {
    formCustomer.reset()
    orders.push(obj) // один заказ
    toStorage()
  }
})

