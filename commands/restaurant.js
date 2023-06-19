import axios from 'axios'
import * as cheerio from 'cheerio'
export default async () => {
  try {
    const websites = [
      'https://eng.taiwan.net.tw/m1.aspx?sNo=0020323&page=1',
      'https://eng.taiwan.net.tw/m1.aspx?sNo=0020323&page=2',
      'https://eng.taiwan.net.tw/m1.aspx?sNo=0020323&page=3',
      'https://eng.taiwan.net.tw/m1.aspx?sNo=0020323&page=4',
      'https://eng.taiwan.net.tw/m1.aspx?sNo=0020323&page=5',
      'https://eng.taiwan.net.tw/m1.aspx?sNo=0020323&page=6',
      'https://eng.taiwan.net.tw/m1.aspx?sNo=0020323&page=7',
      'https://eng.taiwan.net.tw/m1.aspx?sNo=0020323&page=8',
      'https://eng.taiwan.net.tw/m1.aspx?sNo=0020323&page=9',
      'https://eng.taiwan.net.tw/m1.aspx?sNo=0020323&page=10',
      'https://eng.taiwan.net.tw/m1.aspx?sNo=0020323&page=11',
      'https://eng.taiwan.net.tw/m1.aspx?sNo=0020323&page=12',
      'https://eng.taiwan.net.tw/m1.aspx?sNo=0020323&page=13',
      'https://eng.taiwan.net.tw/m1.aspx?sNo=0020323&page=14',
      'https://eng.taiwan.net.tw/m1.aspx?sNo=0020323&page=15',
      'https://eng.taiwan.net.tw/m1.aspx?sNo=0020323&page=16',
      'https://eng.taiwan.net.tw/m1.aspx?sNo=0020323&page=17',
      'https://eng.taiwan.net.tw/m1.aspx?sNo=0020323&page=18',
      'https://eng.taiwan.net.tw/m1.aspx?sNo=0020323&page=19'
    ]
    const restaurants = []
    for (const website of websites) {
      const { data } = await axios.get(website)
      const $ = cheerio.load(data)
      $('tbody').each((index, element) => {
        const restaurant = {}
        restaurant.name = $(element).find('.name').text().trim()
        restaurant.type = $(element).find('[data-th="Type:"]').text().trim()
        const addressElement = $(element).find('div > span:contains("Address:")')
        const contactElement = $(element).find('div:contains("TEL:")')
        const contactText = contactElement.text().trim()
        restaurant.phone = contactText.match(/TEL:(.*?)\s/)?.[1] || null
        restaurant.address = addressElement.next('a').text().trim()
        restaurant.addressLink = addressElement.next('a').attr('href')
        const coordinates = restaurant.addressLink.match(/daddr=([-0-9.]+),([-0-9.]+)/)
        restaurant.latitude = coordinates ? parseFloat(coordinates[1]) : null
        restaurant.longitude = coordinates ? parseFloat(coordinates[2]) : null
        if (!restaurant.type.includes('Accommodation')) {
          restaurants.push(restaurant)
        }
      })
    }

    // console.log(restaurants.length)

    return restaurants
  } catch (error) {
    console.error('Error occurred:', error)
    return []
  }
}
