// Default QR code options for the application
// This centralizes all default styling and configuration for QR codes

const defaultQROptions = {
  width: 300,
  height: 300,
  type: 'svg',
  data: 'https://example.com',
  image: '',
  margin: 10,
  qrOptions: {
    typeNumber: 0,
    mode: 'Byte',
    errorCorrectionLevel: 'Q'
  },
  imageOptions: {
    hideBackgroundDots: true,
    imageSize: 0.4,
    margin: 15,
    crossOrigin: 'anonymous',
  },
  dotsOptions: {
    color: '#000000',
    type: 'square',
    gradient: null
  },
  backgroundOptions: {
    color: '#FFFFFF',
  },
  cornersSquareOptions: {
    color: '#000000',
    type: 'square',
    gradient: null
  },
  cornersDotOptions: {
    color: '#000000',
    type: 'square',
    gradient: null
  },
};

export default defaultQROptions;
