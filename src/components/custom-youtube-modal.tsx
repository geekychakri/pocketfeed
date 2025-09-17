import { usePathname } from "next/navigation";

import { YouTubeEmbed } from "@next/third-parties/google";
import * as DialogPrimitive from "@radix-ui/react-dialog";

import Bookmark from "@/app/(dashboard)/read/components/bookmark";
import { cn } from "@/lib/utils";

import BookmarkPodcast from "./PodcastPlayer/bookmark-podcast";
import { SpinnerRotate } from "./SpinnerRotate";

export default function CustomYouTubeModal({
  //   trigger,
  feedItem,
  videoId,
  title,
  open,
  onOpenChange,
  bookmarkId,
}: {
  //   trigger: React.ReactNode;
  feedItem: string;
  videoId: string;
  title: string;
  open: boolean;
  onOpenChange: () => void;
  bookmarkId?: string;
}) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      {/* <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger> */}
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="DialogOverlay">
          <DialogPrimitive.Content
            className="DialogContent data-[state=open]:animate-contentShow flex flex-col gap-5 outline-0"
            onFocusCapture={(e) => {
              e.stopPropagation(); //TODO:
            }}
          >
            <div className="flex h-7 items-center justify-between gap-4 px-5">
              <h1 className="line-clamp-1 flex-1">{title}</h1>

              <BookmarkPodcast
                // bookmarked={bookmarkExists}
                bookmarkFeedItem={feedItem}
                bookmarkLink={videoId}
                bookmarkType="youtube"
                // bookmarkId={bookmarkId}
                bookmarkTitle={title}
                btnClassName="relative flex size-6 items-center justify-center rounded-full p-0"
              />
            </div>
            <div className="relative aspect-video">
              {/* <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <SpinnerRotate />
              </div> */}
              <YouTubeEmbed
                videoid={videoId}
                // title="HEllo"
                // width={100}
                // width="100%"
                style="aspect-ratio:16/9;max-width:100%"
                playlabel="Play"
                params="rel=0"

                // params="controls=0"
              />
            </div>

            {/* <p className="max-w-[500px]">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Voluptates ducimus non natus porro assumenda voluptatem at!
                Iusto cupiditate perspiciatis dignissimos nesciunt quod itaque
                ex, adipisci consectetur repellat deleniti rerum. Fugit dicta
                impedit quo provident tenetur vitae minima voluptate, quidem
                eius, quia repudiandae, consequuntur nam blanditiis assumenda
                eveniet! Consequuntur, modi ratione! Ea laborum optio voluptate
                est nam inventore at voluptas sapiente enim veritatis, atque
                ipsa pariatur, necessitatibus dignissimos accusantium corporis
                exercitationem eveniet. Iusto dolore nostrum, odio dolorem et
                quia reiciendis est inventore, rerum recusandae pariatur sed
                natus? Iure excepturi blanditiis qui aut ad perspiciatis
                voluptates reiciendis sint repellat aliquam natus nam doloribus
                nesciunt, quae ducimus architecto dolores. Praesentium
                accusantium ea voluptatibus, enim, harum ratione esse iure sequi
                quaerat laboriosam adipisci? Neque cumque repellendus asperiores
                amet commodi atque nesciunt provident incidunt ut? Voluptatibus
                fuga dolor quae facere a temporibus reprehenderit quis vitae
                error aut distinctio quaerat ab commodi minus, aliquam possimus
                velit. Saepe, delectus animi facere voluptatibus dolores
                obcaecati nihil beatae rem libero. Rem assumenda, dolores
                officiis aliquid repudiandae voluptas nam est ex ad soluta
                beatae suscipit laborum quisquam recusandae minima nihil,
                facilis odio illum amet. Nulla dicta recusandae quam. Cupiditate
                non exercitationem facere dicta labore maiores atque nihil
                eveniet qui unde architecto repellendus amet provident sint,
                tempore hic praesentium autem mollitia explicabo voluptatem,
                ratione nesciunt perferendis debitis quisquam. Nostrum
                voluptates tempore facere quas tenetur animi quo, est quod
                veritatis aliquid odio sint in omnis, dolore optio unde, nihil
                aut porro voluptatem non? Sapiente laboriosam totam eaque at
                autem dicta maxime ex ratione vel atque corrupti nemo a nulla
                eos recusandae pariatur exercitationem illo enim est, adipisci
                aperiam, reiciendis dolorem amet? Aspernatur nemo obcaecati
                officiis veniam accusantium magnam laboriosam consectetur
                consequatur sed, velit asperiores nulla provident. Optio,
                temporibus cupiditate dolor sapiente natus ullam laudantium
                harum laboriosam iusto nemo distinctio ipsam necessitatibus
                quaerat! Debitis quis mollitia ipsum! Exercitationem suscipit
                adipisci ratione cumque nemo sed id ex iusto, a expedita ipsam
                illo consequatur facilis nesciunt praesentium eligendi ea soluta
                natus iste quos maxime eum sint molestiae dolorum.
                Necessitatibus voluptatum nesciunt debitis? Reiciendis
                aspernatur fugiat dicta? Inventore, nihil dignissimos? Iste
                cumque quos blanditiis incidunt, accusamus iusto? Necessitatibus
                placeat doloribus, dolor expedita autem adipisci, dolorum dicta
                ipsum officia deserunt dolorem commodi reiciendis vel
                accusantium quaerat, molestiae nihil culpa! Corrupti, magni
                laboriosam similique perferendis ex maxime totam omnis
                inventore! Nesciunt impedit soluta eum autem beatae ea nemo
                dolores asperiores expedita sequi ducimus vitae minima
                temporibus est, nobis veniam molestias eos ex earum eveniet ad
                porro sunt tempore doloremque? Praesentium corporis sapiente
                ratione officia distinctio dolorem quam velit neque iste totam
                quos voluptate dolor tempora ducimus nobis cum, ullam facere
                atque error deserunt repudiandae! Quis, eius aspernatur in
                corrupti possimus voluptas omnis voluptatibus atque natus
                dolores officiis. Eveniet voluptate rem at inventore facere
                architecto nulla neque numquam? Praesentium, ut! Eligendi optio,
                repudiandae inventore architecto quos at consectetur vel
                officiis beatae atque ab maiores ratione doloribus sequi nihil
                hic blanditiis quo exercitationem excepturi ad dolorum autem
                dolor neque iusto? Mollitia nobis neque voluptatibus,
                accusantium quaerat numquam voluptatum architecto magni?
              </p> */}
          </DialogPrimitive.Content>
        </DialogPrimitive.Overlay>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
