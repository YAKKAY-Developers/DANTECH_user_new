export interface Order {
    workOrder:string,
    status: string,
    woStatus:string,
    doctor:string
    doctorId: string,
    date:string,
    product:string,
    files:string,
    image:string
}

export const TopSelling: Order[] = [

    {
        workOrder:'D00989',
        status: 'danger',
        woStatus: 'In Production',
        doctor:'Rajan',
        doctorId:'D0189',
        date:'12-Dec',
        image: 'assets/images/users/user.svg',
        product: 'Teeth Mold',
        files: 'assets/images/files/1.jpg',
    },
    {
        workOrder:'D00990',
        status: 'warning',
        woStatus: 'Yet to start',
        doctor:'Dilip',
        doctorId:'D0009',
        date:'14-Dec',
        image: 'assets/images/users/user.svg',
        product: 'Teeth set',
        files: 'assets/images/files/2.jpg',
    },
    {
        workOrder:'D00590',
        status: 'success',
        woStatus: 'In Production',
        doctor:'Edwin',
        doctorId:'D0009',
        date:'9-Dec',
        image: 'assets/images/users/user.svg',
        product: 'Teeth Denture',
        files: 'assets/images/files/3.jpg',
    },
    {
        workOrder:'D00989',
        status: 'danger',
        woStatus: 'Yet to start',
        doctor:'Rajan',
        doctorId:'D0189',
        date:'12-Dec',
        image: 'assets/images/users/user.svg',
        product: 'Teeth Mold',
        files: 'assets/images/files/1.jpg',
    },
    {
        workOrder:'D00990',
        status: 'warning',
        woStatus: 'Yet to start',
        doctor:'Dilip',
        doctorId:'D0009',
        date:'14-Dec',
        image: 'assets/images/users/user.svg',
        product: 'Teeth set',
        files: 'assets/images/files/2.jpg',
    },
    {
        workOrder:'D00590',
        status: 'success',
        woStatus: 'Yet to start',
        doctor:'Edwin',
        doctorId:'D0009',
        date:'9-Dec',
        image: 'assets/images/users/user.svg',
        product: 'Teeth Denture',
        files: 'assets/images/files/3.jpg',
    }
    

]