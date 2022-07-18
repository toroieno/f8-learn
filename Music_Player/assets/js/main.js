
// 1. Render song 
// 2. Scroll top
// 3. Play / pause / seek
// 4. CD rotate
// 5. Next / prev
// 6. Random
// 7. Next / Repeat when ended
// 8. Active song
// 9. Scroll active song into view
// 10. Play song when click

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const play = $('.player')
const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const cdAudio = $('#audio')
const playBtn = $('.btn-toggle-play')

const app = {
    currentIndex : 0,
    isPlaying: false,
    songs: [
        {
            name: 'Nevada',
            singer: 'Vicetone',
            path: './assets/music/Nevada-Monstercat.mp3',
            image: './assets/img/nevada.jpg'
        },
        {
            name: 'Lemon Tree',
            singer: 'FoolsGarden',
            path: './assets/music/LemonTree-FoolsGarden.mp3',
            image: './assets/img/LemonTree.png'
        },
        {
            name: 'My Love',
            singer: 'Westlife',
            path: './assets/music/MyLove-Westlife.mp3',
            image: './assets/img/MyLove.jpg'
        },
        {
            name: 'Summertime',
            singer: 'K391',
            path: './assets/music/Summertime-K391.mp3',
            image: './assets/img/summertime.jpg'
        },
        {
            name: 'The FatRat',
            singer: 'DJ',
            path: './assets/music/TheFatRat-DJ.mp3',
            image: './assets/img/TheFatRat.jpg'
        },
        {
            name: 'Nevada',
            singer: 'Vicetone',
            path: './assets/music/Nevada-Monstercat.mp3',
            image: './assets/img/nevada.jpg'
        },
        {
            name: 'Lemon Tree',
            singer: 'FoolsGarden',
            path: './assets/music/LemonTree-FoolsGarden.mp3',
            image: './assets/img/LemonTree.png'
        },
        {
            name: 'My Love',
            singer: 'Westlife',
            path: './assets/music/MyLove-Westlife.mp3',
            image: './assets/img/MyLove.jpg'
        },
        {
            name: 'Summertime',
            singer: 'K391',
            path: './assets/music/Summertime-K391.mp3',
            image: './assets/img/summertime.jpg'
        },
        {
            name: 'The FatRat',
            singer: 'DJ',
            path: './assets/music/TheFatRat-DJ.mp3',
            image: './assets/img/TheFatRat.jpg'
        },

    ],
    render: function() {
        var htmls = this.songs.map(function(song){
            return `
                <div class="song">
                    <div class="thumb" style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        var playList = $('.playlist');
        playList.innerHTML = htmls.join('');
    },
    defineProperties: function(){
        Object.defineProperty(this, 'currentSong', {
            get: function(){
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents: function(){
        const _this = this
        const cdWidth = cd.offsetWidth

        //xử lí phóng to, thu nhỏ CD
        document.onscroll = function(){
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }

        //Xử lý khi click play
        playBtn.onclick = function(){
            if (_this.isPlaying){
                cdAudio.pause()
            } 
            else {
                cdAudio.play()
            }
        }

        //Khi phát nhạc
        cdAudio.onplay = function(){
            _this.isPlaying = true
            play.classList.add('playing')
        }
        //Khi dừng nhạc
        cdAudio.onpause = function(){
            _this.isPlaying = false
            play.classList.remove('playing')
        }
    },
    loadCurrentSong: function(){
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        cdAudio.src = this.currentSong.path
    },
    start : function(){
        //định nghĩa các thuộc tính object
        this.defineProperties()

        //Lắng nghe / xử lý các sự kiện (DOM event)
        this.handleEvents()

        //Tải thông tin bài hát đầu tiên vào UI
        this.loadCurrentSong()

        //Render playlist
        this.render()
    }
}

app.start()