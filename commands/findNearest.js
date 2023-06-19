import calculateDistance from './calculateDistance.js'
export default function findNearestOrganizations(userLatitude, userLongitude, organizations) {
  organizations.forEach(org => {
    org.distance = calculateDistance(userLatitude, userLongitude, org.latitude, org.longitude)
  })

  organizations.sort((a, b) => a.distance - b.distance)

  const uniqueOrganizations = []
  const organizationNames = new Set()

  organizations.forEach(org => {
    if (!organizationNames.has(org.name)) {
      uniqueOrganizations.push(org)
      organizationNames.add(org.name)
    }
  })

  return uniqueOrganizations.slice(0, 5)
}
