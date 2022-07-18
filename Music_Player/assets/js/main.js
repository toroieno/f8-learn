
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

const PLAY_STORAGE_KEY = 'json-storage'

const play = $('.player')
const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const cdAudio = $('#audio')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playList = $('.playlist');

const app = {
    currentIndex : 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAY_STORAGE_KEY)) || {},
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
    setConfig: function(key, value){
        this.config[key] = value
        localStorage.setItem(PLAY_STORAGE_KEY, JSON.stringify(this.config))
    },
    render: function() {
        const _this = this
        const htmls = this.songs.map(function(song, index){
            return `
                <div class="song ${index === _this.currentIndex ? 'active' : ''}" data-index="${index}">
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

        // Xử lý CD quay và dừng
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg'}
        ], {
            duration: 10000, //10 seconds
            iterations: Infinity
        })
        cdThumbAnimate.pause()

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
            cdThumbAnimate.play()
        }
        //Khi dừng nhạc
        cdAudio.onpause = function(){
            _this.isPlaying = false
            play.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        //Khi tiến độ bài hát thay đổi
        cdAudio.ontimeupdate = function(){
            const progressPercent = Math.floor(cdAudio.currentTime / cdAudio.duration * 100)
            progress.value = progressPercent
        }

        //Xử lý khi tua bài hát
        progress.onchange = function(e){
            const seekTime = e.target.value * cdAudio.duration / 100
            cdAudio.currentTime = seekTime
        }

        //Chuyển bài
        nextBtn.onclick = function(){
            if (_this.isRandom){
                _this.playRandomSong()
            }else{
                _this.nextSong()
            }
            cdAudio.play()
            _this.render()
            _this.scrollSongActive()
        }
        prevBtn.onclick = function(){
            if (_this.isRandom){
                _this.playRandomSong()
            }else{
                _this.prevSong()    
            }
            cdAudio.play()
            _this.render()
            _this.scrollSongActive()
        }

        //random bài hát
        randomBtn.onclick = function(e) {
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom)
        }

        // Xử lý next song khi audio ended
        cdAudio.onended = function(){
            if (_this.isRepeat){
                cdAudio.play()
            }else {
                nextBtn.click()
            }
        }

        //Xử lý phát lại bài hát
        repeatBtn.onclick = function(){
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        //click vào tên bài hát
        playList.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)')
            //Xử lí khi click vào song
            if ( songNode || e.target.closest('.option'))
            {
                //click vào song
                if (songNode){
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    cdAudio.play()
                }
                //click vào option
                if (e.target.closest('.option')){

                }
            }
        }
    },
    loadCurrentSong: function(){
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        cdAudio.src = this.currentSong.path
    },
    loadConfig: function(){
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },
    scrollSongActive: function(){
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            })
        }, 300)
    },
    nextSong: function(){
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        } 
        this.loadCurrentSong()
    },
    prevSong: function(){
        this.currentIndex--
        if (this.currentIndex < 0){
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    playRandomSong: function(){
        var newIndex
        do{
            newIndex = Math.floor(Math.random() * this.songs.length)
        }while(newIndex === this.currentIndex)

        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    start : function(){
        //Gán cấu hình từ config vào ứng dụng 
        this.loadConfig()

        //định nghĩa các thuộc tính object
        this.defineProperties()

        //Lắng nghe / xử lý các sự kiện (DOM event)
        this.handleEvents()

        //Tải thông tin bài hát đầu tiên vào UI
        this.loadCurrentSong()
        
        //Render playlist
        this.render()

        //Hiển thị trạng thái ban đầu của Button Repeat & Random
        repeatBtn.classList.toggle('active', _this.isRepeat)
        randomBtn.classList.toggle('active', _this.isRandom)
    }
}

app.start()