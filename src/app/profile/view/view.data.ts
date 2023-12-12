export interface Viewdata {
  clinicname: string;
  clinicno: number;
  clinicaddress: string;
  Specialisation: string;
  Email: string;
  cliniccity: string;
  clinicstate: string;
  dob: string;
  image: string;
  affiliation: string;
  licenseid: string;
  Clinicname: string;
  clinicclinicaddress: string;
  clinicnumber: number;
  Yearsofexperience: number;
  profilecompletionpercentage: string;
  gst: string;
  bankacc: string;
  ifsc: string;
  bankbranch: string;
  paymentmethod: string;
}

export const viewdat: Viewdata[] = [
  {
    clinicname: 'None',
    clinicno: NaN,
    clinicaddress: 'None',
    Specialisation: 'None',
    Email: 'None',
    cliniccity: 'None',
    clinicstate: 'None',
    dob: 'None',
    image: 'assets/images/users/user.svg',
    affiliation: 'None',
    licenseid: 'None',
    Clinicname: 'None',
    clinicclinicaddress: 'None',
    clinicnumber: NaN,
    Yearsofexperience: NaN,
    profilecompletionpercentage: '',
    gst: 'None',
    bankacc: 'None',
    ifsc: 'None',
    bankbranch: 'None',
    paymentmethod: 'None',
  },
];

// table doctors
export interface doclist {
  clinicid: string;
  doctorid: string;
  doctorname: string;
}

export const doctorlist: doclist[] = [
  {
    clinicid: 'CLI123',
    doctorid: 'CLI12301',
    doctorname: 'Dr.Ahiva',
  },
  {
    clinicid: 'CLI123',
    doctorid: 'CLI12302',
    doctorname: 'Dr.Ahiva bro',
  },
  {
    clinicid: 'CLI123',
    doctorid: 'CLI12303',
    doctorname: 'Dr.Nanthitha',
  },
  {
    clinicid: 'CLI123',
    doctorid: 'CLI12304',
    doctorname: 'Dr.Elsheba',
  },
  {
    clinicid: 'CLI123',
    doctorid: 'CLI12305',
    doctorname: 'Dr.Lalika',
  },
  {
    clinicid: 'CLI123',
    doctorid: 'CLI12306',
    doctorname: 'Dr.Diana',
  },
];
