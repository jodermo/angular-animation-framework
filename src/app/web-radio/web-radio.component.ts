import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, map } from 'rxjs/operators';
import { throwError } from 'rxjs';

(window as any).radio = window['radio'] || {
  audio: null,
  station: null,
  searchResult: null,
  filter: null,
  volume: 1,
};

@Component({
  selector: 'app-web-radio',
  templateUrl: './web-radio.component.html',
  styleUrls: ['./web-radio.component.scss'],
})
export class WebRadioComponent implements OnInit {
  @Output() onPlay = new EventEmitter<HTMLAudioElement>();
  searchApiUrl = 'http://www.radio-browser.info/webservice/json/';
  filter = {
    type: null,
    by: null,
    value: null,
    order: 'name',
    limit: 100,
    offset: 0,
    reverse: false,
    exact: false,
    prefix: null,
  };
  filterTypes = [
    {
      name: 'stations',
      filterBy: ['name', 'codec', 'country', 'state', 'language', 'tag', 'id', 'uuid'],
      options:null
    },
  ];
  oderTypes = ['name', 'url', 'homepage', 'favicon', 'tags', 'country', 'state', 'language', 'votes', 'negativevotes', 'codec', 'bitrate', 'lastcheckok', 'lastchecktime', 'clicktimestamp', 'clickcount', 'clicktrend'];
  currentFilterType = this.filterTypes[0];
  searchResult = [] as any;
  searching = false;
  audioFile: any;
  streamUrl = '';
  currentRadio = null;
  lastVolume = 1;
  playbackDuration = 0;
  playbackDurationString = null;
  playbackTime = 0;
  playbackTimeString = null;
  audioState = 'none';

  constructor(private http: HttpClient) {


  }

  ngOnInit() {

    if (window && window['radio'] && window['radio'].audio) {

      this.audioFile = window['radio'].audio;
      this.currentRadio = window['radio'].station || null;
      this.searchResult = window['radio'].searchResult || null;
      if (window['radio'].filter) {
        this.filter = window['radio'].filter;
      }
      this.selectFilterByType(this.filter.type || this.filterTypes[0].name);
    } else {
      this.filter.type = localStorage.getItem('radio-filter-type') || null;
      this.filter.prefix = localStorage.getItem('radio-filter-prefix') || null;
      this.filter.by = localStorage.getItem('radio-filter-by') || null;
      if (localStorage.getItem('radio-filter-value')) {
        this.filter.value = localStorage.getItem('radio-filter-value');
        this.searchRadios(localStorage.getItem('radio-name') || null);
      } else {
        this.selectFilterByType(this.filter.type || this.filterTypes[0].name);
      }
    }
    this.playbackEvents();

  }

  selectFilterByType(type) {

    let filterType = null;
    for (const fType of this.filterTypes) {
      if (fType.name === type) {
        filterType = fType;
      }
    }
    console.log('selectFilterByType', type, filterType);
    if (filterType) {
      this.selectFilterType(filterType);
    }
  }

  selectFilterType(filterType) {
    this.currentFilterType = filterType;
    this.filter.prefix = filterType.urlPrefix;
    this.filter.type = filterType.name;
    this.filter.by = null;
    if (filterType.filterBy && filterType.filterBy.length) {
      this.filter.by = filterType.filterBy[0];
    }
    this.filter.value = null;
    if (filterType.options && filterType.options.length) {
      this.filter.value = filterType.options[0];
    }
    window['radio'].filter = this.filter;
    console.log(this.currentFilterType, this.filter);
    return this.filter;
  }

  searchRadios(selectRadioName: any = null) {
    if (this.filter.value) {
      localStorage.setItem('radio-filter-prefix', this.filter.prefix);
      localStorage.setItem('radio-filter-type', this.filter.type);
      localStorage.setItem('radio-filter-by', this.filter.by);
      localStorage.setItem('radio-filter-value', this.filter.value);
      this.searching = true;
      this.searchResult = [];
      window['radio'].searchResult = [];
      let exactStr = '';
      if (this.filter.exact) {
        exactStr = 'exact';
      }
      let searchUrl = this.searchApiUrl + '/' + this.filter.type + '/by' + this.filter.by + exactStr + '/' + this.filter.value + '?limit=' + this.filter.limit;

      if (this.filter.order) {
        searchUrl += '&order=' + this.filter.order;
      }
      if (this.filter.reverse) {
        searchUrl += '&reverse=true';
      }
      this.get(searchUrl).subscribe((data) => {
        this.searchResult = data;
        window['radio'].searchResult = this.searchResult;
        this.searching = false;
        if (selectRadioName) {
          this.searchResult.forEach(radio => {
            if (radio.name && radio.name === selectRadioName) {
              return this.selectRadio(radio);
            }
          });
        }
      }, (error) => {
        this.searching = false;
      });
    }

  }

  selectRadio(radio: any) {
    window['radio'].station = radio;
    localStorage.setItem('radio-name', radio.name || null);
    this.currentRadio = radio;
    this.streamUrl = radio.url;
    this.startStream();
  }

  selectNextRadio() {
    if (this.currentRadio && this.searchResult) {
      let next = null;
      for (let i = 0; i < this.searchResult.length; i++) {
        if (this.searchResult[i] === this.currentRadio) {
          if (i < this.searchResult.length - 1) {
            next = this.searchResult[i + 1];
          } else {
            next = this.searchResult[0];
          }
        }
      }
      if (next) {
        this.selectRadio(next);
      } else {
        this.selectRadio(this.searchResult[0]);
      }
    }
  }

  selectPrevRadio() {
    if (this.currentRadio && this.searchResult) {
      let next = null;
      for (var i = 0; i < this.searchResult.length; i++) {
        if (this.searchResult[i] === this.currentRadio) {
          if (i > 0) {
            next = this.searchResult[i - 1];
          } else {
            next = this.searchResult[this.searchResult.length - 1];
          }
        }
      }
      if (next) {
        this.selectRadio(next);
      } else {
        this.selectRadio(this.searchResult[this.searchResult.length - 1]);
      }
    }
  }

  startStream() {
    this.removeStream();
    if (this.streamUrl) {
      if (window['radio'] && window['radio'].audio) {
        window['radio'].audio.pause();
        window['radio'].audio.removeAttribute('src');
        window['radio'].audio.load();
      }
      this.audioState = 'loading';
      if (!this.audioFile) {
        this.audioFile = new Audio();
      }
      this.audioFile.autoplay = true;
      this.audioFile.crossOrigin = 'anonymous';
      this.audioFile.src = this.streamUrl;
      window['radio'].audio = this.audioFile;
      window['radio'].station = this.currentRadio;
      this.onPlay.emit(this.audioFile);
      this.playbackEvents();
    }
  }

  removeStream() {
    window['radio'].audio = null;
    window['radio'].station = null;
    if (this.audioFile) {
      this.audioFile.pause();
      this.audioFile.removeAttribute('src');
      this.audioFile.load();
    }
  }

  playbackEvents() {
    if (this.audioFile) {
      this.audioFile.volume = this.lastVolume;
      this.audioFile.onplay = () => {
        this.audioState = 'playing';
      };
      this.audioFile.onpause = () => {
        this.audioState = 'paused';
      };
      this.audioFile.ontimeupdate = () => {
        this.playbackTime = this.audioFile.currentTime;
        this.playbackTimeString = this.valToTime(this.playbackTime);
        this.playbackDuration = this.audioFile.duration;
        this.playbackDurationString = this.valToTime(this.playbackDuration);
      };
      this.audioFile.oncanplay = () => {
        if (this.audioFile.paused) {
          this.audioFile.play();
        }
      };
    }
  }

  valToTime(value: number) {
    const format = (val) => {
      val = parseInt(val);
      if (val < 10) {
        return '0' + val;
      } else {
        return String(val);
      }
    };
    const s = value % 60;
    const m = (value / 60) % 60;
    const h = ((value / 60) % 60) % 60;
    if (value) {
      return format(h) + ':' + format(m) + ':' + format(s);
    } else {
      return null;
    }

  }

  togglePause() {
    if (this.audioFile && this.audioFile.paused) {
      this.audioFile.play();
    } else if (this.audioFile && !this.audioFile.paused) {
      this.audioFile.pause();
    }
  }


  toggleMute() {
    if (this.audioFile) {
      if (this.audioFile.volume === 0) {
        this.audioFile.volume = this.lastVolume;
      } else {
        this.lastVolume = this.audioFile.volume;
        this.audioFile.volume = 0;
      }
    }
  }

  get(url) {
    return this.http.get(url)
      .pipe(
        tap( // Log the result or error
          data => console.log(url, data),
          this.handleError
        )
      );
  }

  private handleError(error) {
    return throwError(error);
  }
}
