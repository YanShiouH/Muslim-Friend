import axios from 'axios'
import * as cheerio from 'cheerio'
export default async () => {
  try {
    const { data } = await axios.get('https://eng.taiwan.net.tw/m1.aspx?sNo=0024694')
    const $ = cheerio.load(data)
    const mosques = []
    $('tr[valign="top"]').each((index, element) => {
      if (index % 2 === 0) {
        const mosqueName = $(element).find('td.word').text().trim()
        mosques.push({
          name: mosqueName
        })
      } else {
        const mosqueAddress = $(element).find('a').text().trim()
        const hrefLink = $(element).find('a').attr('href')
        const coordinates = hrefLink.match(/daddr=([-0-9.]+),([-0-9.]+)/)
        const mosqueLatitude = coordinates ? parseFloat(coordinates[1]) : null
        const mosqueLongitude = coordinates ? parseFloat(coordinates[2]) : null

        mosques[mosques.length - 1].address = mosqueAddress
        mosques[mosques.length - 1].latitude = mosqueLatitude
        mosques[mosques.length - 1].longitude = mosqueLongitude
      }
    })
    return mosques
  } catch (error) {
    console.error('Error occurred:', error)
    return []
  }
}
