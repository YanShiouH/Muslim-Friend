import 'dotenv/config'
import linebot from 'linebot'
import { getByDay } from 'prayertiming'
import mosques from './commands/mosque.js'
import organizations from './commands/organization.js'
import findNearest from './commands/findNearest.js'
import templateOrganization from './templates/organization.js'
import templateRestaurant from './templates/restaurant.js'
import restaurants from './commands/restaurant.js'

const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})

bot.on('follow', async function (event) {
  await event.reply({
    type: 'text',
    text: 'Send your location for more services.',
    quickReply: {
      items: [
        {
          type: 'action',
          action: {
            type: 'location',
            label: 'Location'
          }
        }
      ]
    }
  })
})

bot.on('message', event => {
  if (event.message.type === 'text' && event.message.text === 'Location') {
    event.reply({
      type: 'text',
      text: 'Send your location for more services.',
      quickReply: {
        items: [
          {
            type: 'action',
            action: {
              type: 'location',
              label: 'Location'
            }
          }
        ]
      }
    })
  }
})
let cityName = ''
let userLatitude = ''
let userLongitude = ''
bot.on('message', async function (event) {
  try {
    if (event.message.type === 'location') {
      userLatitude = event.message.latitude
      userLongitude = event.message.longitude
      const addressComponents = event.message.address.split(',')
      let cityNameComponent = addressComponents.filter(component =>
        component.includes('County') || component.includes('county') || component.includes('縣')
      )
      if (cityNameComponent.length === 0) {
        cityNameComponent = addressComponents.filter(component =>
          component.includes('City') || component.includes('city') || component.includes('市')
        )
      }
      cityName = cityNameComponent[0].trim()
      const currentTime = new Date()
      const currentHours = currentTime.getHours()
      const currentMinutes = currentTime.getMinutes()
      function timeStringToTimeObject(timeString) {
        const [hours, minutes] = timeString.split(':')
        return { hours: parseInt(hours, 10), minutes: parseInt(minutes, 10) }
      }
      const prayTime = getByDay({
        currentTime,
        long: userLongitude,
        lat: userLatitude,
        method: 'Karachi',
        timeFormat: '24h'
      })
      const prayerTimes = [
        { name: 'Fajr', time: timeStringToTimeObject(prayTime.fajr) },
        { name: 'Sunrise', time: timeStringToTimeObject(prayTime.sunrise) },
        { name: 'Dhuhr', time: timeStringToTimeObject(prayTime.dhuhr) },
        { name: 'Asr', time: timeStringToTimeObject(prayTime.asr) },
        { name: 'Maghrib', time: timeStringToTimeObject(prayTime.maghrib) },
        { name: 'Isha', time: timeStringToTimeObject(prayTime.isha) }
      ]
      const nextPrayer = prayerTimes.find(prayer =>
        (prayer.time.hours > currentHours) ||
        (prayer.time.hours === currentHours && prayer.time.minutes > currentMinutes)
      )
      if (nextPrayer) {
        event.reply([
          {
            type: 'text', text: `According to your time zone, the next prayer is ${nextPrayer.name} at ${nextPrayer.time.hours}:${nextPrayer.time.minutes}.\nTap for more services.`
          }
        ])
      } else {
        event.reply('All prayers for today have passed. Please check again tomorrow or tap for other services.')
      }
    }
    const mosqueData = await mosques()
    console.log('Event message type:', event.message.type)
    console.log('Event message text:', event.message.text)
    console.log('City name:', cityName)
    console.log('userLongitude:', userLongitude)
    console.log('userLatitude:', userLatitude)
    if (event.message.type === 'text' && event.message.text === 'Mosque') {
      if (!cityName) {
        event.reply('Please send your location first.')
      } else if (cityName === '新北市' || cityName === 'New Taipei City' || cityName.includes('台北市') || cityName.includes('臺北市') || cityName.includes('Taipei City')) {
        event.reply([
          {
            type: 'text', text: 'Mosque(s) near you:'
          },
          {
            type: 'location',
            title: mosqueData[0].name,
            address: mosqueData[0].address,
            latitude: mosqueData[0].latitude,
            longitude: mosqueData[0].longitude
          },
          {
            type: 'location',
            title: mosqueData[1].name,
            address: mosqueData[1].address,
            latitude: mosqueData[1].latitude,
            longitude: mosqueData[1].longitude
          }
        ])
      } else if (cityName === 'Taoyuan City' || cityName.includes('桃園市')) {
        event.reply([
          {
            type: 'text', text: 'Mosque(s) near you:'
          },
          {
            type: 'location',
            title: mosqueData[2].name,
            address: mosqueData[2].address,
            latitude: mosqueData[2].latitude,
            longitude: mosqueData[2].longitude
          },
          {
            type: 'location',
            title: mosqueData[3].name,
            address: mosqueData[3].address,
            latitude: mosqueData[3].latitude,
            longitude: mosqueData[3].longitude
          }
        ])
      } else if (cityName === 'Taichung City' || cityName.includes('臺中市') || cityName.includes('台中市')) {
        event.reply([
          {
            type: 'text', text: 'Mosque(s) near you:'
          },
          {
            type: 'location',
            title: mosqueData[4].name,
            address: mosqueData[4].address,
            latitude: mosqueData[4].latitude,
            longitude: mosqueData[4].longitude
          }
        ])
      } else if (cityName === 'Tainan City' || cityName.includes('臺南市') || cityName.includes('台南市')) {
        event.reply([
          {
            type: 'text', text: 'Mosque(s) near you:'
          },
          {
            type: 'location',
            title: mosqueData[5].name,
            address: mosqueData[5].address,
            latitude: mosqueData[5].latitude,
            longitude: mosqueData[5].longitude
          }
        ])
      } else if (cityName === 'Kaohsiung City' || cityName.includes('高雄市')) {
        event.reply([
          {
            type: 'text', text: 'Mosque(s) near you:'
          },
          {
            type: 'location',
            title: mosqueData[6].name,
            address: mosqueData[6].address,
            latitude: mosqueData[6].latitude,
            longitude: mosqueData[6].longitude
          }
        ])
      } else if (cityName === 'Pingtung County' || cityName.includes('屏東縣')) {
        event.reply([
          {
            type: 'text', text: 'Mosque(s) near you:'
          },
          {
            type: 'location',
            title: mosqueData[7].name,
            address: mosqueData[7].address,
            latitude: mosqueData[7].latitude,
            longitude: mosqueData[7].longitude
          }
        ])
      } else if (cityName.includes('花蓮縣') || cityName.includes('花蓮市') || cityName === 'Hualien City' || cityName === 'Hualien County') {
        event.reply([
          {
            type: 'text', text: 'Mosque(s) near you:'
          },
          {
            type: 'location',
            title: mosqueData[7].name,
            address: mosqueData[7].address,
            latitude: mosqueData[7].latitude,
            longitude: mosqueData[7].longitude
          }
        ])
      } else {
        event.reply([
          {
            type: 'text', text: 'Sorry, there is no mosque in your city.'
          }])
      }
    }
  } catch (error) {
    console.error('Error occurred:', error)
    event.reply('Oops! An error occurred while processing your request. Please try again later.')
  }
})

bot.on('message', async function (event) {
  try {
    // console.log(organizationData)
    if (event.message.type === 'text' && event.message.text === 'Muslim-friendly Environment') {
      if (!cityName) {
        event.reply('Please send your location first.')
      } else {
        const organizationData = await organizations()
        const bubbleData = findNearest(userLatitude, userLongitude, organizationData)
        const flexContents = []
        bubbleData.forEach((element, index) => {
          const bubble = JSON.parse(JSON.stringify(templateOrganization))
          bubble.body.contents[0].text = element.name
          bubble.body.contents[1].text = element.address
          bubble.body.contents[1].action.uri = element.addressLink
          bubble.body.contents[3].contents[0].contents[1].text = element.waterFriendlyWashrooms
          bubble.body.contents[3].contents[1].contents[1].text = element.facilitiesForRitualAblution
          bubble.body.contents[3].contents[2].contents[1].text = element.prayerRoom
          flexContents.push(bubble)
        })
        event.reply({
          type: 'flex',
          altText: 'Muslim-friendly Environment',
          contents: {
            type: 'carousel',
            contents: flexContents
          }
        })
      }
      // console.log(findNearest(userLatitude, userLongitude, organizationData))
    }
  } catch (error) {
    console.error('Error occurred:', error)
    event.reply('Oops! An error occurred while processing your request. Please try again later.')
  }
})

bot.on('message', async function (event) {
  try {
    // console.log(restaurantData)
    if (event.message.type === 'text' && event.message.text === 'Dining') {
      if (!cityName) {
        event.reply('Please send your location first.')
      } else {
        const restaurantData = await restaurants()
        const bubbleData = findNearest(userLatitude, userLongitude, restaurantData)
        // console.log(bubbleData)
        const flexContents = []
        bubbleData.forEach((element, index) => {
          const bubble = JSON.parse(JSON.stringify(templateRestaurant))
          bubble.body.contents[0].text = element.name
          bubble.body.contents[1].contents[0].contents[1].text = element.type
          bubble.body.contents[1].contents[1].contents[1].text = element.phone
          bubble.body.contents[1].contents[2].contents[0].action.uri = element.addressLink
          bubble.body.contents[1].contents[2].contents[0].text = element.address

          flexContents.push(bubble)
        })
        event.reply({
          type: 'flex',
          altText: 'Dining',
          contents: {
            type: 'carousel',
            contents: flexContents
          }
        })
      }
    }
  } catch (error) {
    console.error('Error occurred:', error)
    event.reply('Oops! An error occurred while processing your request. Please try again later.')
  }
})
bot.listen('/', process.env.PORT || 3000, () => {
  console.log('機器人已開啟')
})
