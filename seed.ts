import { PrismaClient, Role, CampaignStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';
const db=new PrismaClient();
async function main(){
 const hash=await bcrypt.hash('ChangeMe123!',12);
 const admin=await db.user.upsert({where:{email:'admin@restolink.local'},update:{},create:{email:'admin@restolink.local',passwordHash:hash,name:'RestoLink Admin',role:Role.ADMIN}});
 const ru=await db.user.upsert({where:{email:'restaurant@restolink.local'},update:{},create:{email:'restaurant@restolink.local',passwordHash:hash,name:'Demo Restaurant',role:Role.RESTAURANT}});
 const pu=await db.user.upsert({where:{email:'partner@restolink.local'},update:{},create:{email:'partner@restolink.local',passwordHash:hash,name:'Demo Creator',role:Role.PARTNER}});
 const r=await db.restaurant.upsert({where:{userId:ru.id},update:{},create:{userId:ru.id,name:'Demo Restaurant',city:'Rabat',category:'Food',credits:6}});
 await db.partner.upsert({where:{userId:pu.id},update:{},create:{userId:pu.id,city:'Rabat',categories:['Food','Lifestyle'],followers:4800,engagementRate:5.2,handle:'@demo_creator',verified:true}});
 await db.subscription.upsert({where:{restaurantId:r.id},update:{},create:{restaurantId:r.id,amount:2500,currency:'MAD',monthlyCredits:6,status:'ACTIVE'}});
 await db.campaign.create({data:{restaurantId:r.id,title:'Campagne Food Rabat',description:'Reel + story autour d’une expérience restaurant.',city:'Rabat',category:'Food',minFollowers:2000,contentTypes:['REEL','STORY'],slots:6,status:CampaignStatus.ACTIVE}});
 console.log('Seeded demo users:',admin.email,ru.email,pu.email);
}
main().finally(()=>db.$disconnect());
