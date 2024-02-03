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
    required: 'Wed 09 Oct 2024',
    product: 'Crown',
    image: 'assets/images/files/1.jpg',
  },


  {
    reference: 'D0002',
    status: 'Completed',
    patient: 'Arjun',
    required: 'Wed 10 Feb 2024',
    product: 'Crown',
    image: 'assets/images/files/1.jpg',
  },

  {
    reference: 'D0003',
    status: 'Not yet started',
    patient: 'Arjun',
    required: 'Wed 16 Feb 2024',
    product: 'Denture',
    image: 'assets/images/files/1.jpg',
  },
  
];
