export interface orderlist {
  reference: string;
  status: string;
  patient: string;
  required: string;
  product: string;
  image: string;
}

export const Orders: orderlist[] = [
  {
    reference: 'D0001',
    status: 'In Production',
    patient: 'Arjun',
    required: 'Wed 16 Oct 2023',
    product: 'Crown',
    image: 'assets/images/files/1.jpg',
  },
  {
    reference: 'D0002',
    status: 'Completed',
    patient: 'Raja',
    required: 'Mon 1 Noc 2023',
    product: 'Inlay',
    image: 'assets/images/files/2.jpg',
  },
  {
    reference: 'D0003',
    status: 'Out for delivery',
    patient: 'Rani',
    required: 'Thur 18 Oct 2023',
    product: 'Onlay',
    image: 'assets/images/files/3.jpg',
  },
  {
    reference: 'D0004',
    status: 'Not Assigned',
    patient: 'John',
    required: 'Tue 25 Oct 2023',
    product: 'Bridge',
    image: 'assets/images/files/4.jpg',
  },
  {
    reference: 'D0005',
    status: 'In Production',
    patient: 'Arul',
    required: 'Wed 25 Nov 2023',
    product: 'Tray',
    image: 'assets/images/files/1.jpg',
  },
  {
    reference: 'D0006',
    status: 'In Production',
    patient: 'Kavin',
    required: 'Sat 16 Dec 2023',
    product: 'Crown',
    image: 'assets/images/files/3.jpg',
  },
  {
    reference: 'D0007',
    status: 'Completed',
    patient: 'Kannan',
    required: 'Wed 11 Dec 2023',
    product: 'Crown',
    image: 'assets/images/files/2.jpg',
  },
  {
    reference: 'D0008',
    status: 'In Production',
    patient: 'Richa',
    required: 'Wed 26 Dec 2023',
    product: 'Crown',
    image: 'assets/images/files/1.jpg',
  },
];
