"use strict";(self.webpackChunkMALSync=self.webpackChunkMALSync||[]).push([[9192],{61285:(t,e,s)=>{s.d(e,{w:()=>o});var i=s(47848),a=s(19701),r=s(13647),n=s(78584);class o extends i.${constructor(){super(...arguments),this.name="AniList",this.compact=!1,this.seperateRewatching=!0,this.authenticationUrl="https://anilist.co/api/v2/oauth/authorize?client_id=1487&response_type=token"}getUserObject(){return a.H2("\n    query {\n      Viewer {\n        name\n        id\n        avatar {\n          large\n        }\n        options {\n          displayAdultContent\n        }\n        mediaListOptions {\n          scoreFormat\n        }\n      }\n    }\n    ",[],!0).then((t=>{if(t.data.Viewer.options&&t.data.Viewer.mediaListOptions){const e=r.settings.get("anilistOptions");e.displayAdultContent=t.data.Viewer.options.displayAdultContent,e.scoreFormat=t.data.Viewer.mediaListOptions.scoreFormat,r.settings.set("anilistOptions",e)}return{username:t.data.Viewer.name,picture:t.data.Viewer.avatar.large||"",href:`https://anilist.co/user/${t.data.Viewer.id}`}}))}deauth(){return r.settings.set("anilistToken","")}accessToken(){return this.api.settings.get("anilistToken")}_getSortingOptions(){return[{icon:"sort_by_alpha",title:r.storage.lang("list_sorting_alpha"),value:"alpha"},{icon:"history",title:r.storage.lang("list_sorting_history"),value:"updated",asc:!0},{icon:"score",title:r.storage.lang("list_sorting_score"),value:"score",asc:!0}]}getOrder(t){switch(t){case"alpha":return"MEDIA_TITLE_ENGLISH";case"updated":return"UPDATED_TIME_DESC";case"updated_asc":return"UPDATED_TIME";case"score":return"SCORE_DESC";case"score_asc":return"SCORE";default:return 1===this.status||this.status,this.getOrder("updated")}}async getPart(){this.offset<1&&(this.offset=1),n.log("[UserList][AniList]",`username: ${this.username}`,`status: ${this.status}`,`offset: ${this.offset}`),this.username||(this.username=await this.getUsername());let t="\n    query ($page: Int, $userName: String, $type: MediaType, $status: MediaListStatus, $sort: [MediaListSort] ) {\n      Page (page: $page, perPage: 100) {\n        pageInfo {\n          hasNextPage\n        }\n        mediaList (status: $status, type: $type, userName: $userName, sort: $sort) {\n          status\n          score(format: POINT_100)\n          progress\n          progressVolumes\n          notes\n          media {\n            siteUrl\n            id\n            idMal\n            episodes\n            chapters\n            volumes\n            status\n            averageScore\n            coverImage{\n              large\n              extraLarge\n            }\n            bannerImage\n            title {\n              userPreferred\n            }\n          }\n        }\n      }\n    }\n    ";this.compact&&(t="\n      query ($page: Int, $userName: String, $type: MediaType, $status: MediaListStatus, $sort: [MediaListSort]) {\n        Page (page: $page, perPage: 100) {\n          pageInfo {\n            hasNextPage\n          }\n          mediaList (status: $status, type: $type, userName: $userName, sort: $sort) {\n            progress\n            media {\n              id\n              idMal\n            }\n          }\n        }\n      }\n      ");const e={page:this.offset,userName:this.username,type:this.listType.toUpperCase(),status:a.Fn[parseInt(this.status.toString())],sort:null},s=this.getOrder(this.sort);return s&&(e.sort=s),a.H2(t,e,!0).then((t=>{n.log("res",t);const e=t.data.Page.mediaList;return this.offset+=1,t.data.Page.pageInfo.hasNextPage||(this.done=!0),this.prepareData(e,this.listType)}))}async prepareData(t,e){const s=[];for(let i=0;i<t.length;i++){const r=t[i];let n;n="anime"===e?await this.fn({uid:r.media.id,malId:r.media.idMal,apiCacheKey:r.media.idMal??`anilist:${r.media.id}`,cacheKey:a.et(r.media.idMal,r.media.id),type:e,title:r.media.title.userPreferred,url:r.media.siteUrl,watchedEp:r.progress,totalEp:r.media.episodes,status:a.tG(r.status),score:Math.round(r.score/10),image:a.Mv(r.media.coverImage.large),imageLarge:a.Mv(r.media.coverImage.extraLarge),imageBanner:a.Mv(r.media.bannerImage),tags:r.notes,airingState:r.anime_airing_status}):await this.fn({uid:r.media.id,malId:r.media.idMal,apiCacheKey:r.media.idMal??`anilist:${r.media.id}`,cacheKey:a.et(r.media.idMal,r.media.id),type:e,title:r.media.title.userPreferred,url:r.media.siteUrl,watchedEp:r.progress,totalEp:r.media.chapters,status:a.tG(r.status),score:Math.round(r.score/10),image:a.Mv(r.media.coverImage.large),imageLarge:a.Mv(r.media.coverImage.extraLarge),imageBanner:a.Mv(r.media.bannerImage),tags:r.notes,airingState:r.anime_airing_status}),null===n.totalEp&&(n.totalEp=0),s.push(n)}return s}prepareCompact(t,e){const s=[];for(let e=0;e<t.length;e++){const i=t[e];s.push({malid:i.media.idMal,id:i.media.id,watchedEp:i.progress,cacheKey:a.et(i.media.idMal,i.media.id)})}return s}}},69555:(t,e,s)=>{s.d(e,{w:()=>u});var i=s(59465),a=s(47848),r=s(76003),n=s(13647),o=s(78584);class u extends a.${constructor(){super(...arguments),this.name="Kitsu",this.authenticationUrl="https://kitsu.app/404?mal-sync=authentication"}async getUserObject(){const t=await this.userRequest(),e=n.settings.get("kitsuOptions");return e.titleLanguagePreference=t.attributes.titleLanguagePreference,e.sfwFilter=t.attributes.sfwFilter,e.ratingSystem=t.attributes.ratingSystem,n.settings.set("kitsuOptions",e),{username:t.attributes.name,picture:t.attributes.avatar?.large||"",href:`https://kitsu.app/users/${t.attributes.slug||t.id}`}}async getUserId(){const t=await n.storage.get("kitsuUserId");if(void 0!==t&&t)return t;const e=await this.userRequest();return n.storage.set("kitsuUserId",e.id),e.id}userRequest(){return r.H2("GET","https://kitsu.app/api/edge/users?filter[self]=true").then((t=>{if(o.log(t),void 0===t.data[0])throw new i.jH("Not Authenticated");return t.data[0]}))}deauth(){return n.settings.set("kitsuToken","").then((()=>n.storage.set("kitsuUserId","")))}accessToken(){return n.settings.get("kitsuToken")}_getSortingOptions(){return[{icon:"sort_by_alpha",title:n.storage.lang("list_sorting_alpha"),value:"alpha",asc:!0},{icon:"history",title:n.storage.lang("list_sorting_history"),value:"updated",asc:!0},{icon:"score",title:n.storage.lang("list_sorting_score"),value:"score",asc:!0}]}getOrder(t){let e="";switch(t.endsWith("_asc")||(e="-"),t.replace("_asc","")){case"alpha":return e=e?"":"-",`${e}${this.listType}.titles.en`;case"updated":return`${e}progressed_at`;case"score":return`${e}rating`;default:return 1===this.status||6===this.status?this.getOrder("updated"):this.getOrder("alpha")}}async getPart(){const t=await this.getUserId();let e="",s="";const i=this.getOrder(this.sort);return i&&(s=`&sort=${i}`),7!==this.status&&(e=`&filter[status]=${r.tG(this.status,this.status)}`),o.log("[UserList][Kitsu]",`user: ${t}`,`status: ${this.status}`,`offset: ${this.offset}`),r.H2("GET",`https://kitsu.app/api/edge/library-entries?filter[user_id]=${t}${e}&filter[kind]=${this.listType}&page[offset]=${this.offset}&page[limit]=50${s}&include=${this.listType},${this.listType}.mappings,${this.listType}.mappings.item&fields[${this.listType}]=slug,titles,canonicalTitle,averageRating,posterImage,coverImage,${"anime"===this.listType?"episodeCount":"chapterCount,volumeCount"}`).then((t=>(o.log(t),this.offset+=50,t.meta.count>this.offset||(this.done=!0),this.prepareData(t,this.listType))))}async prepareData(t,e){const s=[];for(let i=0;i<t.data.length;i++){const a=t.data[i],n=t.included[i],o=r.LK(n.attributes.titles,n.attributes.canonicalTitle);let u,l=NaN;for(let s=0;s<t.included.length;s++){const i=t.included[s];if("mappings"===i.type&&i.attributes.externalSite===`myanimelist/${e}`&&i.relationships.item.data.id===n.id){l=Number(i.attributes.externalId),t.included.splice(s,1);break}}u="anime"===e?await this.fn({malId:l,apiCacheKey:l,uid:Number(n.id),cacheKey:r.et(l,n.id),kitsuSlug:n.attributes.slug,type:e,title:o,url:`https://kitsu.app/${e}/${n.attributes.slug}`,watchedEp:a.attributes.progress,totalEp:n.attributes.episodeCount,status:r.tG(a.attributes.status),score:Math.round(a.attributes.ratingTwenty/2),image:n.attributes.posterImage&&n.attributes.posterImage.small?n.attributes.posterImage.small:"",imageLarge:n.attributes.posterImage&&n.attributes.posterImage.original?n.attributes.posterImage.original:"",imageBanner:n.attributes.coverImage&&n.attributes.coverImage.large?n.attributes.coverImage.large:"",tags:a.attributes.notes,airingState:n.anime_airing_status}):await this.fn({malId:l,apiCacheKey:l,uid:Number(n.id),cacheKey:r.et(l,n.id),kitsuSlug:n.attributes.slug,type:e,title:o,url:`https://kitsu.app/${e}/${n.attributes.slug}`,watchedEp:a.attributes.progress,totalEp:n.attributes.chapterCount,status:r.tG(a.attributes.status),score:Math.round(a.attributes.ratingTwenty/2),image:n.attributes.posterImage&&n.attributes.posterImage.small?n.attributes.posterImage.small:"",imageLarge:n.attributes.posterImage&&n.attributes.posterImage.original?n.attributes.posterImage.original:"",imageBanner:n.attributes.coverImage&&n.attributes.coverImage.large?n.attributes.coverImage.large:"",tags:a.attributes.notes,airingState:n.anime_airing_status}),null===u.totalEp&&(u.totalEp=0),s.push(u)}return s}}},49082:(t,e,s)=>{s.d(e,{et:()=>a,sG:()=>n,sz:()=>r});var i=s(13647);function a(t,e){return`local:${t}:${e}`}async function r(){let t;if("userscript"===i.type){const e=await i.storage.list("sync");for(const t in e)e[t]=await i.storage.get(t);t=e}else t=i.storage.list("sync");return t}function n(t){return new RegExp(`^local://[^/]*/${t}`,"i")}},88870:(t,e,s)=>{s.d(e,{w:()=>o});var i=s(47848),a=s(49082),r=s(78584),n=s(26017);class o extends i.${constructor(){super(...arguments),this.name="local",this.authenticationUrl="",this.getRegex=a.sG,this.getSyncList=a.sz,this.getCacheKey=a.et}async getUserObject(){return Promise.resolve({username:"local",picture:"",href:""})}_getSortingOptions(){return[]}async getPart(){return r.log("[UserList][Local]",`status: ${this.status}`),this.done=!0,await this.prepareData(await this.getSyncList(),this.listType,this.status)}async prepareData(t,e,s){const i=[];for(const a in t)if(this.getRegex(e).test(a)){const o=t[a];if(r.log(a,o),7!==s&&parseInt(o.status)!==s)continue;"anime"===e?i.push(await this.fn({airingState:2,image:o.image??"",imageLarge:o.image??"",malId:0,apiCacheKey:0,tags:o.tags,title:`[L] ${o.name}`,totalEp:0,status:o.status,score:o.score,type:"anime",uid:a,url:a,cacheKey:this.getCacheKey(n.urlPart(a,4),n.urlPart(a,2)),watchedEp:o.progress},o.sUrl)):i.push(await this.fn({airingState:2,image:o.image??"",imageLarge:o.image??"",malId:0,apiCacheKey:0,tags:o.tags,title:`[L] ${o.name}`,totalEp:0,status:o.status,score:o.score,type:"manga",uid:a,url:a,cacheKey:this.getCacheKey(n.urlPart(a,4),n.urlPart(a,2)),watchedEp:o.progress},o.sUrl))}return r.log("data",i),i}}},81124:(t,e,s)=>{s.d(e,{w:()=>o});var i=s(47848),a=s(70248),r=s(13647),n=s(78584);class o extends i.${constructor(){super(...arguments),this.name="MyAnimeList",this.authenticationUrl=a.As,this.limit=100,this.apiCall=a.H2}async getUserObject(){return this.apiCall({type:"GET",path:"users/@me"}).then((t=>({username:t.name,picture:t.picture,href:`https://myanimelist.net/profile/${t.name}`})))}deauth(){return r.settings.set("malToken","").then((()=>r.settings.set("malRefresh","")))}_getSortingOptions(){return[{icon:"sort_by_alpha",title:r.storage.lang("list_sorting_alpha"),value:"alpha"},{icon:"history",title:r.storage.lang("list_sorting_history"),value:"updated"},{icon:"score",title:r.storage.lang("list_sorting_score"),value:"score"},{icon:"calendar_month",title:r.storage.lang("list_sorting_airing_date"),value:"airing_date"}]}getOrder(t){switch(t){case"alpha":return`${this.listType}_title`;case"updated":return"list_updated_at";case"score":return"list_score";case"airing_date":return`${this.listType}_start_date`;default:return 1===this.status||6===this.status?this.getOrder("updated"):this.getOrder("alpha")}}async getPart(){this.limit=100,this.modes.frontend&&(this.limit=24);const t=this.getOrder(this.sort);let e="";t&&(e=`&sort=${t}`),n.log("[UserList][MAL]",`username: ${this.username}`,`status: ${this.status}`,`offset: ${this.offset}`,`sorting: ${e}`);let s="";return 7!==this.status&&(s="manga"===this.listType?`&status=${a.d2[this.status]}`:`&status=${a.fz[this.status]}`),this.apiCall({type:"GET",path:`users/@me/${this.listType}list?nsfw=true&limit=${this.limit}&offset=${this.offset}${s}${e}`,fields:["list_status{tags,is_rewatching,is_rereading,start_date,finish_date}","num_episodes","num_chapters","num_volumes"]}).then((t=>(t.paging&&t.paging.next?this.offset+=this.limit:this.done=!0,this.prepareData(t.data))))}async prepareData(t){const e=[];for(let s=0;s<t.length;s++){const i=t[s];"anime"===this.listType?e.push(await this.fn({uid:i.node.id,malId:i.node.id,apiCacheKey:i.node.id,cacheKey:i.node.id,type:this.listType,title:i.node.title,url:`https://myanimelist.net/${this.listType}/${i.node.id}`,watchedEp:i.list_status.num_episodes_watched,totalEp:i.node.num_episodes,status:parseInt(a.fz[i.list_status.status]),score:i.list_status.score,image:i.node.main_picture?.medium??"",imageLarge:i.node.main_picture?.large||i.node.main_picture?.medium||"",tags:i.list_status.tags.length?i.list_status.tags.join(","):"",airingState:i.anime_airing_status})):e.push(await this.fn({uid:i.node.id,malId:i.node.id,apiCacheKey:i.node.id,cacheKey:i.node.id,type:this.listType,title:i.node.title,url:`https://myanimelist.net/${this.listType}/${i.node.id}`,watchedEp:i.list_status.num_chapters_read,totalEp:i.node.num_chapters,status:parseInt(a.d2[i.list_status.status]),score:i.list_status.score,image:i.node.main_picture?.medium??"",imageLarge:i.node.main_picture?.large||i.node.main_picture?.medium||"",tags:i.list_status.tags.length?i.list_status.tags.join(","):"",airingState:i.anime_airing_status}))}return console.log(e),e}}},48374:(t,e,s)=>{s.d(e,{w:()=>i});const i=s(81124).w},7648:(t,e,s)=>{s.d(e,{w:()=>u});var i=s(59465),a=s(47848),r=s(78371),n=s(13647),o=s(78584);class u extends a.${constructor(){super(...arguments),this.name="Simkl",this.authenticationUrl=r.OT(),this.errorHandling=r.Q9,this.syncList=r.Iy,this.translateList=r.tG,this.getCacheKey=r.et,this.getEpisode=r.qm,this.call=r.T1}async getUserObject(){return this.call("https://api.simkl.com/users/settings").then((t=>{if(t&&t.user&&void 0!==t.user.name)return{username:t.user.name,picture:t.user.avatar||"",href:`https://simkl.com/${t.account.id}`};throw new i.jH("Not Authenticated")}))}deauth(){return n.settings.set("simklToken","")}_getSortingOptions(){return[]}async getPart(){if(o.log("[UserList][Simkl]",`status: ${this.status}`),"manga"===this.listType)throw new Error("Does not support manga");return this.syncList().then((async t=>{this.done=!0;const e=await this.prepareData(Object.values(t),this.listType,this.status);return o.log(e),e}))}async prepareData(t,e,s){const i=[];for(let a=0;a<t.length;a++){const r=t[a],n=this.translateList(r.status);if(7!==s&&parseInt(n)!==s)continue;let o=this.getEpisode(r.last_watched);if(2===n&&(o=r.total_episodes_count),"anime"===e){const t=await this.fn({malId:r.show.ids.mal,apiCacheKey:r.show.ids.mal,uid:r.show.ids.simkl,cacheKey:this.getCacheKey(r.show.ids.mal,r.show.ids.simkl),type:e,title:r.show.title,url:`https://simkl.com/${e}/${r.show.ids.simkl}`,watchedEp:o,totalEp:r.total_episodes_count,status:n,score:r.user_rating?r.user_rating:0,image:`https://simkl.in/posters/${r.show.poster}_ca.jpg`,imageLarge:`https://simkl.in/posters/${r.show.poster}_m.jpg`,imageBanner:`https://simkl.in/posters/${r.show.poster}_w.jpg`,tags:r.private_memo,airingState:r.anime_airing_status});i.push(t)}}return i}}},47848:(t,e,s)=>{s.d(e,{$:()=>h});var i=s(69099),a=s(18770),r=s(92959),n=s(59465),o=s(13647),u=s(78584),l=s(26017);Object.seal(r.P);class h{constructor(t=1,e="anime",s="default"){return this.status=t,this.listType=e,this.sort=s,this.done=!1,this.loading=!1,this.firstLoaded=!1,this.seperateRewatching=!1,this.modes={frontend:!1,sortAiring:!1,initProgress:!1,cached:!1},this.username="",this.offset=0,this.templist=[],this.api=o,this.cacheObj=void 0,this.status=Number(this.status),this.logger=u.m("[S]","#348fff"),this}setTemplist(t){return this.templist=t,this}getTemplist(){return this.templist}setSort(t){if(this.firstLoaded||this.loading)throw"To late to change sort";this.sort=t}isDone(){return this.done}isLoading(){return this.loading}isFirstLoaded(){return this.firstLoaded}async getCompleteList(){do{await this.getNext()}while(!this.done);return this.modes.sortAiring&&await this.sortAiringList(),this.modes.cached&&this.getCache().setValue(this.templist.slice(0,18)),this.firstLoaded=!0,this.templist}async getNextPage(){return this.done?this.templist:!this.modes.frontend||1!==this.status||"default"!==this.sort&&"unread"!==this.sort?(await this.getNext(),this.modes.cached&&this.getCache().setValue(this.templist.slice(0,24)),this.firstLoaded=!0,this.templist):(this.modes.sortAiring=!0,this.getCompleteList())}async getNext(){this.loading=!0;const t=await this.getPart();this.templist=this.templist.concat(t),this.loading=!1}async getCached(){if(await this.getCache().hasValue()){const t=await this.getCache().getValue();return t.forEach((t=>{(t=this.fn(t)).watchedEp="",t.score=""})),t}return[]}initFrontendMode(){this.modes.frontend=!0,this.updateListener=r.P.on("update.*",(t=>{if(u.log("update",t),t.cacheKey){const e=this.templist.find((e=>e.cacheKey===t.cacheKey));u.log(e),e&&t.state&&(e.watchedEp=t.state.episode,e.score=t.state.score,e.status=t.state.status)}}),{objectify:!0})}destroy(){this.updateListener&&this.updateListener.off()}getUsername(){return this.getUserObject().then((t=>t.username))}getSortingOptions(t=!1){const e=[{icon:"filter_list",title:o.storage.lang("settings_progress_default"),value:"default"}];return 1===this.status&&"manga"===this.listType&&e.push({icon:"adjust",title:o.storage.lang("list_sorting_unread"),value:"unread"}),this._getSortingOptions().forEach((s=>{if(!t){if(s.asc){const t={...s};delete t.asc,t.value+="_asc",t.title+=" Ascending",e.push(t)}delete s.asc}e.push(s)})),e}flashmError(t){l.flashm(this.errorMessage(t),{error:!0,type:"error"})}errorMessage(t){return(0,n.gJ)(t,this.authenticationUrl)}async fn(t,e=""){let s=null;return t.fn={continueUrl:()=>null!==s?s:l.getContinueWaching(t.type,t.cacheKey).then((e=>{const i=parseInt(t.watchedEp.toString());return void 0===e||e.ep!==i+1?"":(s=e.url,s)})),initProgress:()=>new a.k(t.cacheKey,t.type).init().then((e=>{t.fn.progress=e})),progress:!1},t.options=await l.getEntrySettings(t.type,t.cacheKey,t.tags),e&&(t.options.u=e),(this.modes.sortAiring||this.modes.initProgress)&&await t.fn.initProgress(),t}async initProgress(){const t=[];this.templist.forEach((e=>{t.push(e.fn.initProgress())})),await Promise.all(t)}async sortAiringList(){if("unread"===this.sort)return void this.sortUnread();const t=[];let e=[],s=[];function i(t,e){let s=t.fn.progress.getPredictionTimestamp(),i=e.fn.progress.getPredictionTimestamp();return s||(s=999999999999),i||(i=s),s-i}this.templist.forEach((i=>{const a=i.fn.progress;"anime"===this.listType?a&&a.isAiring()&&a.getPredictionTimestamp()?i.watchedEp<a.getCurrentEpisode()?e.push(i):s.push(i):t.push(i):a&&a.isAiring()&&a.getCurrentEpisode()&&i.watchedEp&&i.watchedEp<a.getCurrentEpisode()&&i.watchedEp+6>a.getCurrentEpisode()?e.push(i):t.push(i)})),e=e.sort(i).reverse(),s=s.sort(i),this.templist=e.concat(s,t)}sortUnread(){this.templist=this.templist.sort((function(t,e){let s=1e4,i=1e4;if(t.fn.progress&&t.fn.progress.getCurrentEpisode()){const e=t.fn.progress.getCurrentEpisode()-t.watchedEp;e>0&&(s=e)}if(e.fn.progress&&e.fn.progress.getCurrentEpisode()){const t=e.fn.progress.getCurrentEpisode()-e.watchedEp;t>0&&(i=t)}return s-i}))}getCache(){return this.cacheObj||(this.cacheObj=new i.l(`list/${this.name}/${this.listType}/${this.status}/${this.sort}`,1728e5)),this.cacheObj}}},58848:(t,e,s)=>{s.d(e,{vS:()=>f,IA:()=>_,V:()=>y});var i=s(91326),a=s(48374),r=s(81124),n=s(61285),o=s(69555),u=s(7648),l=s(47848),h=s(27010),d=s(13647),p=s(78584);class c extends l.${constructor(){super(...arguments),this.name="Shiki",this.seperateRewatching=!0,this.authenticationUrl=h.GC,this.tempList=[]}getUserObject(){return h.FT().then((t=>({username:t.nickname,picture:t.image.x80,href:t.url})))}deauth(){return d.settings.set("shikiToken","")}_getSortingOptions(){return[]}getSortingOptions(){return[]}async getPart(){if(this.offset<2&&(this.offset=0),p.log("[UserList][Shiki]",`username: ${this.username}`,`status: ${this.status}`,`offset: ${this.offset}`),!this.tempList.length){let t="";7!==this.status&&(t=h.Fn[this.status]);const e=await h.J3();this.tempList=await h.H2({path:"v2/user_rates",type:"GET",parameter:{user_id:e,target_type:"anime"===this.listType?"Anime":"Manga",status:t}})}const t=this.tempList.slice(this.offset,this.offset+25);this.offset+=25,this.offset>=this.tempList.length&&(this.done=!0);const e=t.map((t=>t.target_id)),s=await h.H2({path:`${this.listType}s`,parameter:{ids:e.join(","),limit:25},type:"GET"}),i={};for(const t in s){const e=s[t];i[e.id]=e}if("manga"===this.listType){const t=Object.keys(i),s=e.filter((e=>!t.includes(e)));if(s.length){const t=await h.H2({path:"ranobe",parameter:{ids:s.join(","),limit:25},type:"GET"});for(const e in t){const s=t[e];i[s.id]=s}}}return this.prepareData(t,i)}async prepareData(t,e){const s=[];for(const i in t){const a=t[i],r=e[a.target_id],n=await this.fn({malId:a.target_id,apiCacheKey:a.target_id,uid:a.target_id,cacheKey:a.target_id,type:"Anime"===a.target_type?"anime":"manga",title:h.DD(r.russian,r.name),url:`${h.bl}${r.url}`,watchedEp:"Anime"===a.target_type?a.episodes:a.chapters,totalEp:"Anime"===a.target_type?r.episodes:r.chapters,status:h.Fn[a.status],score:a.score?a.score:0,image:r.image.original?`${h.bl}${r.image.original}`:"",imageLarge:r.image.original?`${h.bl}${r.image.original}`:"",tags:a.text});s.push(n)}return s}}var g=s(88870),m=s(13647);async function f(...t){let e=[];if(m.settings.get("localSync")){const[s,i]=t,a=new g.w(s,i);a.modes.initProgress=!0,e=await a.getCompleteList()}const s=w(t);return s.setTemplist(e),s}function y(...t){return w(t)}function _(t,e=[]){return w(e,t)}function w(t,e=""){e||(e=i.$(t[1]?t[1]:"anime"));const[s,l,h]=t;if("MAL"===e)return new a.w(s,l,h);if("MALAPI"===e)return new r.w(s,l,h);if("ANILIST"===e)return new n.w(s,l,h);if("KITSU"===e)return new o.w(s,l,h);if("SIMKL"===e)return new u.w(s,l,h);if("SHIKI"===e)return new c(s,l,h);throw"Unknown sync mode"}},24298:(t,e,s)=>{s.d(e,{A:()=>p});var i=s(20641),a=s(50953),r=s(53751),n=s(90033);const o={class:"radio-slider"},u=["id","value"],l=["for","onKeyup"],h=(t=>((0,i.Qi)("data-v-3123a098"),t=t(),(0,i.jt)(),t))((()=>(0,i.Lk)("div",{class:"select-pill"},null,-1))),d=(0,i.pM)({__name:"form-switch",props:{options:{type:Array,required:!0},modelValue:{type:String,require:!0,default:""}},emits:["update:modelValue"],setup(t,{emit:e}){const s=t,d=e,p=(0,i.EW)({get:()=>s.modelValue,set(t){d("update:modelValue",t)}}),c=Math.floor(1e4*Math.random());return(e,s)=>((0,i.uX)(),(0,i.CE)("div",o,[((0,i.uX)(!0),(0,i.CE)(i.FK,null,(0,i.pI)(t.options,((t,e)=>((0,i.uX)(),(0,i.CE)(i.FK,{key:t.value},[(0,i.bo)((0,i.Lk)("input",{id:`radio-${(0,a.R1)(c)}-${e}`,"onUpdate:modelValue":s[0]||(s[0]=t=>p.value=t),class:"input",type:"radio",name:"radio-slide",value:t.value},null,8,u),[[r.vModelRadio,p.value]]),(0,i.Lk)("label",{class:"label",for:`radio-${(0,a.R1)(c)}-${e}`,tabindex:"0",onKeyup:(0,r.withKeys)((e=>p.value=t.value),["enter"])},(0,n.v_)(t.title),41,l)],64)))),128)),h]))}}),p=(0,s(66262).A)(d,[["styles",["/* stylelint-disable prettier/prettier */\n/* Aspect ratios */\n/* Transitions */\n/* Typography */\n/* Shadows */\n/* Fonts */\n@keyframes skeleton-loading-malsync-3123a098 {\nto {\n    transform: translateX(100%);\n}\n}\n.radio-slider[data-v-3123a098] {\n  user-select: none;\n  border-radius: 30px;\n  border: 2px solid var(--cl-backdrop);\n  background-color: var(--cl-foreground);\n  display: inline-flex;\n  align-items: stretch;\n  padding: 0;\n}\n.radio-slider .label[data-v-3123a098] {\n  border-radius: 30px;\n  cursor: pointer;\n  display: inline-flex;\n  align-items: center;\n  padding: 5px 10px;\n  margin: -2px;\n  transition: background-color 0.25s, color 0.25s;\n}\n.radio-slider :checked + label[data-v-3123a098] {\n  border-radius: 30px;\n  background-color: var(--cl-primary);\n  color: white;\n}\n.radio-slider[data-v-3123a098]:focus-visible {\n  outline: 2px solid var(--cl-secondary);\n}\n.radio-slider .input[data-v-3123a098] {\n  display: none;\n}\n"]],["__scopeId","data-v-3123a098"],["__file","form-switch.vue"]])},82186:(t,e,s)=>{s.d(e,{A:()=>o});var i=s(20641);const a={class:"square-spinner"},r=[(t=>((0,i.Qi)("data-v-68101cfe"),t=t(),(0,i.jt)(),t))((()=>(0,i.Lk)("div",{class:"e1"},null,-1)))],n={},o=(0,s(66262).A)(n,[["render",function(t,e){return(0,i.uX)(),(0,i.CE)("div",a,r)}],["styles",[".square-spinner[data-v-68101cfe] {\n  position: relative;\n  height: 50px;\n  width: 50px;\n  margin: 50px auto;\n}\n.square-spinner .e1[data-v-68101cfe] {\n  position: absolute;\n  top: 0;\n  right: 0;\n  left: 0;\n  bottom: 0;\n  border-radius: 50%;\n  border-top: 5px solid var(--cl-text);\n  border-bottom: 5px solid var(--cl-text);\n  border-left: 5px solid transparent;\n  border-right: 5px solid transparent;\n  animation: spinner-68101cfe 0.75s infinite;\n}\n@keyframes spinner-68101cfe {\n0% {\n    transform: rotateZ(45deg);\n}\n70% {\n    transform: rotateZ(225deg);\n}\n100% {\n    transform: rotateZ(225deg);\n}\n}\n"]],["__scopeId","data-v-68101cfe"],["__file","spinner.vue"]])}}]);
//# sourceMappingURL=9192.js.map