type Category = {
    id: string
    name: string
    description: string
    parentCategory: {
        children: Category[]
    },
    parentCategoryId: string | null
};

type Product = {
    id: string
    name: string
    description: string
    categoryId: string
    picture: string
    category?: Category
};


export type {Category, Product}
