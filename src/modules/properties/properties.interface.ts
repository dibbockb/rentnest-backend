export interface INewProperty {
    location: string,
    price: number,
    category_name: string,
}

export interface IUpdateProperty {
    location?: string,
    price?: number,
    category_name?: string
}