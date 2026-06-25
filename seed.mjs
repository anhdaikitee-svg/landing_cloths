import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function generateSlug(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')       // Replace spaces with -
    .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
    .replace(/\-\-+/g, '-')     // Replace multiple - with single -
}

const data = {
  "T-shirt": [
    "Sweat zip", "Sweat yan", "Hoodie shirt", "Youth hoodie", "Sweat shirt", 
    "Youth sweat", "Toddler sweat", "Polo", "Baby tee", "Tank top", 
    "Spaghetti strap", "Short", "Joggers"
  ],
  "Wash hat": [
    "Normal hat", "Baseball hat", "Camo hat", "Floral hat"
  ],
  "Canvas bag": [
    "Toiletry bag", "Apron", "Ornament", "Baby flag", "Sash", "Stole"
  ]
}

async function main() {
  for (const [parentName, children] of Object.entries(data)) {
    // Upsert parent category
    const parentSlug = generateSlug(parentName)
    let parent = await prisma.category.findUnique({ where: { slug: parentSlug } })
    if (!parent) {
      parent = await prisma.category.create({
        data: { name: parentName, slug: parentSlug }
      })
    }

    // Upsert children
    for (const childName of children) {
      const childSlug = generateSlug(childName)
      const existingChild = await prisma.category.findUnique({ where: { slug: childSlug } })
      if (!existingChild) {
        await prisma.category.create({
          data: { name: childName, slug: childSlug, parentId: parent.id }
        })
      } else {
        await prisma.category.update({
          where: { id: existingChild.id },
          data: { parentId: parent.id }
        })
      }
    }
  }
  console.log("Seeding complete!")
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
