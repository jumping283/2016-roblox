export const getStatusText = (status) => {
  switch (status) {
    case 'Open':
      return 'Pending approval from you';
    default:
      return status;
  }
}