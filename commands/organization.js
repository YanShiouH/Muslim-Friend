import axios from 'axios'
import * as cheerio from 'cheerio'
export default async () => {
  try {
    const websites = ['https://eng.taiwan.net.tw/m1.aspx?sNo=0022187&page=1',
      'https://eng.taiwan.net.tw/m1.aspx?sNo=0022187&page=2',
      'https://eng.taiwan.net.tw/m1.aspx?sNo=0022187&page=3',
      'https://eng.taiwan.net.tw/m1.aspx?sNo=0022187&page=4',
      'https://eng.taiwan.net.tw/m1.aspx?sNo=0022187&page=5',
      'https://eng.taiwan.net.tw/m1.aspx?sNo=0022187&page=6',
      'https://eng.taiwan.net.tw/m1.aspx?sNo=0022187&page=7',
      'https://eng.taiwan.net.tw/m1.aspx?sNo=0022187&page=8'
    ]
    const organizations = []
    const requests = websites.map(website => {
      return axios.get(website)
    })
    const results = await Promise.all(requests)
    for (const result of results) {
      // const { data } = await axios.get(website)
      const $ = cheerio.load(result.data)
      $('tbody').each((index, element) => {
        const organization = {}
        organization.name = $(element).find('.name').text().trim()
        organization.waterFriendlyWashrooms = $(element).find('[data-th="Water-Friendly Washrooms:"] span').text().trim()
        organization.facilitiesForRitualAblution = $(element).find('[data-th="Facilities for Ritual Ablution:"] span').text().trim()
        organization.prayerRoom = $(element).find('[data-th="Prayer Room:"] span').text().trim()

        const addressElement = $(element).find('div > span:contains("Address:")')
        organization.address = addressElement.next('a').text().trim()
        organization.addressLink = addressElement.next('a').attr('href')

        const coordinates = organization.addressLink.match(/daddr=([-0-9.]+),([-0-9.]+)/)
        organization.latitude = coordinates ? parseFloat(coordinates[1]) : null
        organization.longitude = coordinates ? parseFloat(coordinates[2]) : null

        organizations.push(organization)
      })
    }
    return organizations
  } catch (error) {
    console.error('Error occurred:', error)
    return []
  }
}
