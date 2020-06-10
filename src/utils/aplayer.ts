/**
 * markdown aplayer 语法设计
 * 栗子:
 * <div
 * data-aplayer
 * data-autoplay="false"
 * data-preload="auto"
 * data-theme="#5895be"
 * data-type="songs 或者 song"
 * data-song="base64(fixed + id)"
 * data-loop="all"
 * data-order="list"
 * data-listmaxheight="349px"></div>
 */
import { song } from '@/api'
import { typeOf } from '@/utils/assist'
import { AxiosResponse } from 'axios'
import { SongData, SongType } from '@/types/api'
import APlayer, { APlayerOptions, LoopMode, OrderMode, Preload } from 'aplayer'

export const handleAPlayer = (el: HTMLElement): Array<Promise<APlayer>> => {
    const aplayer: NodeListOf<HTMLElement> = el.querySelectorAll('div[data-aplayer]')

    const arrayAplayer: Array<Promise<APlayer>> = []

    for (let i = 0, len = aplayer.length; i < len; i++) {
        arrayAplayer.push(createAPlayer(aplayer[i]))
    }

    return arrayAplayer
}

export const createAPlayer = async (el: HTMLElement): Promise<APlayer> => {
    const data: DOMStringMap = el.dataset
    const options: APlayerOptions = {
        container: el,
        fixed: data.fixed ? Boolean(data.fixed) : false,
        mini: data.mini ? Boolean(data.mini) : false,
        autoplay: data.autoplay ? Boolean(data.autoplay) : false,
        theme: data.theme ? data.theme : '#b7daff',
        loop: data.loop ? (data.loop as LoopMode) : 'all',
        order: data.order ? (data.order as OrderMode) : 'list',
        preload: data.preload ? (data.preload as Preload) : 'auto',
        mutex: data.mutex ? Boolean(data.mutex) : true,
        lrcType: data.lrcType ? Number(data.lrcType) : 3,
        listFolded: data.listFolded ? Boolean(data.listFolded) : false,
        listMaxHeight: data.listMaxHeight ? Number(data.listMaxHeight) : 350,
        audio: [],
    }

    const songData: SongData = {
        type: data.type ? (data.type as SongType) : 'song',
        song: data.song ? data.song : '',
    }

    const response: AxiosResponse = await song(songData)

    if (response.status === 200) {
        options.audio = typeOf(response.data) === 'array' ? response.data : [response.data]
    }

    return Promise.resolve(new APlayer(options))
}

// 销毁 APlayer
export const destroyAPlayer = (aplayer: APlayer | APlayer[]): void => {
    if (typeOf(aplayer) === 'object') { aplayer = [(aplayer as APlayer)] }

    for (let i = 0, len = (aplayer as APlayer[]).length; i < len; i++) {
        (aplayer as APlayer[])[i].destroy()
    }
}