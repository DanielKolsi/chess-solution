import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  wrapper: {
    position: 'relative'
  },
  main: {
    display: 'flex',
    padding: [{ unit: 'px', value: 0 }, { unit: 'em', value: 1 }, { unit: 'px', value: 0 }, { unit: 'em', value: 1 }],
    marginTop: [{ unit: 'px', value: 100 }]
  },
  chess: {
    flex: '1 1 80%',
    display: 'flex',
    flexFlow: 'column nowrap',
    position: 'relative'
  },
  row: {
    width: [{ unit: '%H', value: 0.8 }],
    display: 'flex',
    borderRight: [{ unit: 'px', value: 3 }, { unit: 'string', value: 'solid' }, { unit: 'string', value: '#333' }],
    borderLeft: [{ unit: 'px', value: 3 }, { unit: 'string', value: 'solid' }, { unit: 'string', value: '#333' }]
  },
  'row:first-child': {
    borderTop: [{ unit: 'px', value: 3 }, { unit: 'string', value: 'solid' }, { unit: 'string', value: '#333' }]
  },
  'row:nth-child(8)': {
    borderBottom: [{ unit: 'px', value: 3 }, { unit: 'string', value: 'solid' }, { unit: 'string', value: '#333' }]
  },
  'row:nth-child(odd) square:nth-child(even)': {
    background: '#CCC8C8'
  },
  'row:nth-child(even) square:nth-child(odd)': {
    background: '#CCC8C8'
  },
  square: {
    flex: '1 1 0',
    display: 'flex',
    flexFlow: 'column nowrap',
    border: [{ unit: 'px', value: 1 }, { unit: 'string', value: 'solid' }, { unit: 'string', value: '$black' }],
    minHeight: [{ unit: 'px', value: 100 }],
    position: 'relative'
  },
  piece: {
    display: 'flex',
    flex: '1 1 auto',
    flexFlow: 'column nowrap',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: [{ unit: 'em', value: 3 }],
    cursor: 'pointer'
  }
});
