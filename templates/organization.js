export default {

  type: 'bubble',
  body: {
    type: 'box',
    layout: 'vertical',
    contents: [
      {
        type: 'text',
        text: '(name)',
        weight: 'bold',
        size: 'xxl',
        margin: 'md',
        wrap: true,
        offsetBottom: 'lg'
      },
      {
        type: 'text',
        text: '(address)',
        size: 'xs',
        color: '#aaaaaa',
        wrap: true,
        action: {
          type: 'uri',
          label: 'action',
          uri: '(addressLink)'
        }
      },
      {
        type: 'separator',
        margin: 'xxl'
      },
      {
        type: 'box',
        layout: 'vertical',
        margin: 'xxl',
        spacing: 'sm',
        contents: [
          {
            type: 'box',
            layout: 'horizontal',
            contents: [
              {
                type: 'text',
                size: 'sm',
                color: '#555555',
                wrap: true,
                text: 'Water-Friendly Washrooms (Bidet/Cleansing Toilet Seats/Hand Showers)',
                flex: 5
              },
              {
                type: 'text',
                text: '(Yes or No)',
                size: 'sm',
                color: '#111111',
                align: 'end',
                flex: 1
              }
            ]
          },
          {
            type: 'box',
            layout: 'horizontal',
            contents: [
              {
                type: 'text',
                text: 'Facilities for Ritual Ablution (Wudu)',
                size: 'sm',
                color: '#555555',
                flex: 0
              },
              {
                type: 'text',
                text: '(Yes or No)',
                size: 'sm',
                color: '#111111',
                align: 'end'
              }
            ]
          },
          {
            type: 'box',
            layout: 'horizontal',
            contents: [
              {
                type: 'text',
                text: 'Prayer Room',
                size: 'sm',
                color: '#555555',
                flex: 0
              },
              {
                type: 'text',
                text: '(Yes or No)',
                size: 'sm',
                color: '#111111',
                align: 'end'
              }
            ]
          }
        ]
      },
      {
        type: 'box',
        layout: 'horizontal',
        margin: 'md',
        contents: []
      }
    ]
  },
  styles: {
    footer: {
      separator: true
    }
  }
}
