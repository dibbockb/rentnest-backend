import { faker } from '@faker-js/faker'
import bcrypt from 'bcryptjs'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { PrismaClient } from '../generated/prisma/client'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 10
const DEFAULT_PASSWORD = '123'

const CATEGORY_NAMES = [
    'apartment',
    'house',
    'studio',
    'duplex',
    'condo',
    'office space',
]

const BD_LOCATIONS = [
    'Gulshan, Dhaka',
    'Banani, Dhaka',
    'Dhanmondi, Dhaka',
    'Uttara, Dhaka',
    'Mirpur, Dhaka',
    'Bashundhara, Dhaka',
    'Mohammadpur, Dhaka',
    'Agrabad, Chattogram',
    'Nasirabad, Chattogram',
    'Zindabazar, Sylhet',
    'Shahjalal Upashahar, Sylhet',
    'Boalia, Rajshahi',
    'Khulshi, Chattogram',
    'Baridhara, Dhaka',
]

function propertyImages(seed: string, count: number) {
    return Array.from({ length: count }, (_, i) =>
        `https://picsum.photos/seed/${seed}-${i}/800/600`
    )
}

async function main() {
    console.log('Clearing existing data...')
    await prisma.reviews.deleteMany()
    await prisma.payments.deleteMany()
    await prisma.rental_Requests.deleteMany()
    await prisma.properties.deleteMany()
    await prisma.categories.deleteMany()
    await prisma.user.deleteMany()

    console.log('Seeding users...')
    const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, SALT_ROUNDS)

    const admin = await prisma.user.create({
        data: {
            name: 'Admin User',
            email: 'admin@rentnest.com',
            password: hashedPassword,
            role: 'ADMIN',
        },
    })

    const landlords = await Promise.all(
        Array.from({ length: 6 }).map((_, i) =>
            prisma.user.create({
                data: {
                    name: faker.person.fullName(),
                    email: `landlord${i + 1}@rentnest.com`,
                    password: hashedPassword,
                    role: 'LANDLORD',
                    profilePhoto: faker.image.avatarGitHub(),
                },
            })
        )
    )

    const tenants = await Promise.all(
        Array.from({ length: 8 }).map((_, i) =>
            prisma.user.create({
                data: {
                    name: faker.person.fullName(),
                    email: `tenant${i + 1}@rentnest.com`,
                    password: hashedPassword,
                    role: 'TENANT',
                    profilePhoto: faker.image.avatarGitHub(),
                },
            })
        )
    )

    console.log('Seeding categories...')
    const categories = await Promise.all(
        CATEGORY_NAMES.map((name) =>
            prisma.categories.create({ data: { name } })
        )
    )

    console.log('Seeding properties...')
    const properties = await Promise.all(
        Array.from({ length: 24 }).map(async (_, i) => {
            const landlord = faker.helpers.arrayElement(landlords)
            const category = faker.helpers.arrayElement(categories)
            const imgSeed = `${category.name}-${i}-${faker.number.int(9999)}`

            return prisma.properties.create({
                data: {
                    location: faker.helpers.arrayElement(BD_LOCATIONS),
                    price: faker.number.int({ min: 8000, max: 90000 }),
                    images: propertyImages(imgSeed, faker.number.int({ min: 3, max: 5 })),
                    is_available: true,
                    landlord_id: landlord.id,
                    category_id: category.id,
                },
            })
        })
    )

    console.log('Seeding reviews...')
    for (const property of faker.helpers.arrayElements(properties, 15)) {
        const reviewers = faker.helpers.arrayElements(tenants, faker.number.int({ min: 1, max: 3 }))
        for (const tenant of reviewers) {
            await prisma.reviews.create({
                data: {
                    property_id: property.id,
                    tenant_id: tenant.id,
                    content: faker.lorem.sentences(2),
                    rating: faker.number.int({ min: 1, max: 5 }),
                },
            })
        }
    }

    console.log('Done.')
    console.log(`Admin login:    admin@rentnest.dev / ${DEFAULT_PASSWORD}`)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(() => prisma.$disconnect())