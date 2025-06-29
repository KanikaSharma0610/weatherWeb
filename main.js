const cityInput = document.querySelector('.input')
const searchBtn = document.querySelector('.btn')
const notFoundSection = document.querySelector('.not-found')
const searchCitySection = document.querySelector('.search-city')
const weatherInfoSection = document.querySelector('.weather-info')
const countryTxt = document.querySelector('.country') 
const tempTxt = document.querySelector('.temp') 
const conditionTxt = document.querySelector('.condition') 
const feelsLikeValue = document.querySelector('.Feels-like-value') 
const windValue = document.querySelector('.wind-value') 
const humidityValue = document.querySelector('.humditity-value')
const foreacastContainerImg = document.querySelector('.item-img')
const weatherSummaryImg = document.querySelector('.weather-summary-container-img')
const currentDateTxt = document.querySelector('.date-txt')
const forecastItemsConatiner=document.querySelector('.forecast-container')

searchBtn.addEventListener('click',()=>{
    if(cityInput.value.trim()!=''){
        updateWeatherInfo(cityInput.value)
        cityInput.value = ''
        cityInput.blur() 
    }
    
})
cityInput.addEventListener('keydown',(event)=>{
    if(event.key=='Enter'&& 
        cityInput.value.trim()!=''
    ){
        updateWeatherInfo(cityInput.value)
        cityInput.value = ''
        cityInput.blur() 

    }
})

async function getFetchData(endPoint,city){
    const apiUrl=`https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=bf72e7720e1d2c88dadc417632d779dd&units=metric`

    const response= await fetch(apiUrl)
    return response.json()

}
function getWeatherIcon(id){
    if (id<=232) return 'thunderstorm.svg'
     if (id<=321) return 'drizzle.svg'
       if (id<=531) return 'rain.svg'
        if (id<=622) return 'snow.svg'
         if (id<=781) return 'atmosphere.svg'
          if (id<=800) return 'clear.svg'
          else return 'clouds.svg'

}

function getCurrentDate(){
    const currentDate=new Date()
    const options={
        weekday: 'short',
        day: '2-digit',
        month: 'short'
    }
    return currentDate.toLocaleDateString('en-GB',options)
}

 async function updateWeatherInfo(city){
    const weatherData= await getFetchData('weather',city)
  
    if(weatherData.cod !=200){
        showDisplaySection(notFoundSection)
        return
    }

     const{
        name: country,
      main: {temp,humidity,feels_like},
      wind:{speed},
      weather:[{id,main}],
     }=weatherData
    
     countryTxt.textContent=country
     tempTxt.textContent = Math.round(temp) + `°C`
     feelsLikeValue.textContent=Math.round(feels_like) + `°C`
     windValue.textContent= Math.round(speed) +` M/s`
     conditionTxt.textContent=main
     humidityValue.textContent=humidity + `%`
     foreacastContainerImg.src=`assests/${getWeatherIcon(id)}`
     weatherSummaryImg.src = `assests/${getWeatherIcon(id)}`
     currentDateTxt.textContent=getCurrentDate()

    await updateForecastInfo(city)
    showDisplaySection(weatherInfoSection)
}

 async function updateForecastInfo(city){
    const forecastsData = await getFetchData('forecast',city)
    const timeTaken ='12:00:00'
    const todayDate = new Date().toISOString().split('T')[0]
    forecastItemsConatiner.innerHTML= ''
    forecastsData.list.forEach(forecastWeather =>{
        if(forecastWeather.dt_txt.includes (timeTaken) && ! forecastWeather.dt_txt.includes(todayDate) ){
       updateForecastItems(forecastWeather)

    }
    })
 }

 function updateForecastItems(weatherData){
  const{
    dt_txt:date,
    weather:[{id}],
    main:{temp}
  }=weatherData

  const dateTaken = new Date(date)
  const dateOption ={
    day: '2-digit',
    month:'short'

  }
  const dateResult = dateTaken.toLocaleDateString('en-US',dateOption)
  const forecastItem=` 
        <div class="forecast-items">
            <h5 class="item-date text">${dateResult}</h5>
            <img src="assests/${getWeatherIcon(id)}" class="item-img">
            <h5 class="item-temp">${Math.round(temp)} °C</h5>
        </div>
        `
        forecastItemsConatiner.insertAdjacentHTML('beforeend',forecastItem)

 }

function showDisplaySection(section){
    [weatherInfoSection, searchCitySection,notFoundSection]
    .forEach(section => section.style.display ='none')
    section.style.display ='flex'
}