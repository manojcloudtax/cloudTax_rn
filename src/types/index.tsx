export interface Categories {
    id: number,
    type: string,
    name: string
}

export interface Expense {
    _id: string,
    name: string,
    notes: string,
    categoryId: number,
    subtotal: number,
    tax: number | null,
    total: number,
    scanId: string,
    date: Date,
    receiptImg: string,
    user: string,
    createdAt: Date,
    updatedAt: Date,
    receiptImgUrl: string,
    receiptImgThumbnailUrl: string,
    __v: number,
    category: Categories
}

export interface apiScanData {
    _id: string,
    date: Date,
    name: string,
    subtotal: string,
    tax: number,
    total: number,
    category: string,
    img_file_name: string,
    img_thumbnail_url: string,
    img_url: string,
    vendor: {
        name: string
    }

}


export interface ExpenseType {
    name: string
    value: string
    id: string
}

export enum SortOptions {
    DATE = "date",
    CATEGORY = "category",
    NAME = "name",
    AMOUNT = "amount",
}

export enum ExpenseTypeOptions {
    PERSONAL = "personal",
    BUSINESS = "business",
    WORKFROMHOME = "workfromhome",
    RENTAL = "rental",
    TRIP = "trip"
}


export interface TripData {
    id: number,
    name: string,
    from: string,
    to: string,
    date: Date,
    total_travel: number,
    travel_duration: {
        start: Date,
        end: Date,
    }
}

export interface columntaxPayload {
    user_identifier: string, // userid reference
    user: {
        email: string
    },
    refund_bank_account: {
        account_type: 'savings'| 'checking',
        routing_number: string,
        account_number: string
      },
      payment_bank_account: {
        account_type: 'savings'| 'checking',
        routing_number: string,
        account_number: string
      },
      address: {
        address: string,
        apt_no: string,
        city: string,
        state: string,
        zip_code: string
      },
      taxpayer_personal_info: {
        date_of_birth: string, //yyyy-MM-DD,
        first_name: string,
        middle_initial: string,
        last_name: string,
        social_security_number: string,
        occupation: string,
        phone: string
      }
}