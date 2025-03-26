import React from "react";
import Image from "next/image";

type RankingUser = {
    id: string;
    name: string;
    image?: string;
    score: number;
    position: number;
};

type RankingProps = {
    rankingUsers: RankingUser[];
};

const RankingUserItem: React.FC<{ user: RankingUser }> = ({ user }) => {
    const userImage = user.image || "/woman2.svg";
    return (
        <div key={user.id} className="flex items-center p-3">
            <div className="flex items-center w-[256px] space-between gap-20">
                <div className="flex items-center gap-6">
                    <Image
                        src={userImage}
                        alt={user.name}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full"
                    />
                    <div className="flex flex-col">
                        <span className="font-bold text-[16px]">{user.name}</span>
                        <span className="text-gray-600 text-[14px] italic">{user.score} pontos</span>
                    </div>
                </div>
                <span className="font-black text-lg italic">{user.position}º</span>
            </div>
        </div>
    );
};

const Ranking: React.FC<RankingProps> = ({ rankingUsers }) => {
    return (
        <div className="w-[347px] h-[993px] bg-borrow shadow-lg rounded-[20px]">
            <h2 className="text-[24px] font-black font-nunito text-center mb-4 mt-8"> ✦ Wormers ✦ </h2>
            <div className="max-h-[calc(100%-95px)] overflow-y-auto flex flex-col items-center pb-7 scrollbar-none font-nunito">
                {rankingUsers.map((user) => (
                    <RankingUserItem key={user.id} user={user} />
                ))}
            </div>
        </div>
    );
};

export default Ranking;
