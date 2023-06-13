export const setAutocomplete = (reference, handleOnSelect, fields = []) => {
  const autocomplete = new window.google.maps.places.Autocomplete(reference, {
    fields: ['address_components', 'formatted_address', 'geometry', ...fields],
  })
  autocomplete.addListener('place_changed', async () => {
    const address = await autocomplete.getPlace()
    handleOnSelect(address)
  })
  return autocomplete
}

export const getAddress = (requestObject) => {
  return new Promise((resolve, reject) => {
    new window.google.maps.Geocoder().geocode(requestObject, (results, status) => {
      if (status === 'OK') {
        resolve(results[0])
      } else {
        reject(status)
      }
    })
  })
}

export const getCurrentPosition = () => {
  return new Promise((resolve, reject) => {
    window.navigator.geolocation.getCurrentPosition(resolve, reject)
  })
}

export const setMapCoordinates = (mapReference, lat, lng, list, zoom = 10) => {
  const map = new window.google.maps.Map(mapReference, {
    zoom,
    center: new window.google.maps.LatLng(lat, lng),
    mapTypeId: window.google.maps.MapTypeId.ROADMAP,
  })
  new window.google.maps.Marker({ position: new window.google.maps.LatLng(lat, lng), map })

  if (list?.length) {
    const infowindow = new window.google.maps.InfoWindow()
    let marker, i

    for (i = 0; i < list.length; i++) {
      marker = new window.google.maps.Marker({
        position: new window.google.maps.LatLng(list[i].Lat, list[i].Lng),
        map: map,
      })

      window.google.maps.event.addListener(
        marker,
        'click',
        (function (marker, i) {
          return function () {
            infowindow.open(map, marker)
          }
        })(marker, i)
      )
    }
  }
}
