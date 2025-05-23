$(function(){	
	$('input#token').keyup(function(e){
		if(e.keyCode===13){
			localStorage.clear();
			token=$(this).val();
		    $.ajax({
		        headers: {
		            "Accept": "*/*",
		            "Content-Type": "application/json"
		        },
		        url: `https://api.trello.com/1/tokens/${token}/member?key=${key}&token=${token}`,
		        type: 'GET',
		        dataType: 'json',
		        async: false,
		        success: function(data) {
					localStorage.setItem('id',data.id);
					localStorage.setItem('username',data.username);
		        } 
		     });
			localStorage.setItem('token',token);
			location.reload();
		}
	});
	if(token!==""&&token!==undefined&&token!==null){
		$('input#token').val(token);
		//
		$(`.tabs div`).click(function(e) {
			$(`.tabs div`).removeClass('active');$(this).addClass('active');
			let idlist=$(this).attr('id');
			let namelist=$(this).text();
			load_cards(idlist, namelist);
		});

		function prj_click() {
			// let idlist=$(this).attr('idlist');
			// let namelist=$(this).attr('namelist');
			let prj=$(this).text();
			$(`#dvCards table tr`).show();
			$(`#dvCards table tr:not([prj="${prj}"])`).hide();
			// load_cards(idlist, namelist,$(this).text());
		};

		function load_cards(idlist, namelist, filter=""){	
			$('#dvCards').html('');
			$('#dvCards').css({});
			$('#dvCards').prev('.project').remove();
			let add_table= async(idlist, namelist)=>{	
				$('#dvCards').html('');
				$('#dvCards').append(`<table id="${idlist}"><thead><tr><th>Project</th><th>Card name</th><th></th></tr></thead><tbody></tbody></table>`);
			}
			add_table(idlist, namelist).then(function(){
				// console.log(get_lists)
				$.ajax(get_lists.url.replace('{id}',idlist).replace('{typeget}','cards')).done(function (card_res) {
					let cards=[];
					$('#dvCards table').before(`<div class="cls_flex project" style="justify-content: flex-end">${project.filter(x=>card_res.filter(x2=>x2.name.indexOf(x.key) > -1).length > 0).map(x=>`<div style="background-color:${x.type};margin-right:0.5em; padding: 0.5em 0.8em">
					<a href="#" class="prj_click" idlist="${idlist}" namelist="${namelist}" style="color:white; white-space: nowrap;">${x.key}</a></div>`).join('')}</div>`);
					$('.prj_click').bind('click',prj_click);
					$.each(card_res, function(ci, card){
						let prj=project.find(x=>card.name.indexOf(x.key)>-1);
						if(prj !== undefined){
							let objCard={
										"id":card.id,
										"original_name":card.name,
										"name":card.name.replace(project.find(x=>card.name.indexOf(x.key)>-1).key,"").replace("-","").trim()
												+ (["🌻 Todo List"].indexOf(namelist)===-1?'<br><b>Last activity: '+ (new Date(card.dateLastActivity)).toLocaleString()+'</b>':'')
												+ ((card.due !== null && prj.index===1)?'<br><b>Deadline: '+ (new Date(card.due)).toLocaleString().split(',')[0]+'</b>':''),
										"member":members.filter(x=>card.idMembers.indexOf(x.id)>-1),
										"project":prj,
									   };
							cards.push(objCard);
						}
					});
					let sort_cards= async(cards)=>{	
						cards.sort(function(a, b){
						    return (a.project.key > b.project.key) && (a.project.index - b.project.index);
						});
						return cards;
					}
					sort_cards(cards).then(function(re_cards){
						re_cards.map(card=>$(`#dvCards > table > tbody`).append(`<tr prj="${card.project.key}" style="background-color:${card.project.color}" id="${card.id}">`));
						$.each(re_cards, function(ca, objCard){
							let col_tool="";
							if(namelist==="🌻 Todo List"){
								col_tool+=`<button style="width:100%" name="${objCard.original_name}" id="${objCard.id}" class="cls_btn_tool booking_card">⚡</button>`;
							}
							else {
								col_tool+=objCard.member.map(mem=>mem_avatar(mem)).join(' ');
								if(namelist==="🎯 Backlog"){
									col_tool+=`<button style="width:100%" name="${objCard.original_name}" id="${objCard.id}" class="cls_btn_tool rebook_card">⚡</button>`;
								}
								else if(namelist==="⚡ Booking Tasks"){
									col_tool+=`<div class="cls_flex">`;
									col_tool+=`<button style="flex: 1 1" name="${objCard.original_name}" id="${objCard.id}" class="cls_btn_tool backlog_card">🎯</button>`;
									col_tool+=`<button style="flex: 1 1" name="${objCard.original_name}" id="${objCard.id}" class="cls_btn_tool complete_card">🎉</button>`;
									col_tool+=`</div>`;
								}
							}
							$(`tr#${objCard.id}`)
									.append(`<td style="white-space: nowrap;">${objCard.project.key}</td>
												<td style="width:100%">${objCard.name}</td>
												<td>${col_tool}</td>
											`);
						});
						$('.cls_btn_tool').bind('click', booking_card_click);
					})
				});
			});
		}
		function booking_card_click(){
			let id=$(this).attr('id');
			let name=$(this).attr('name');
			let cls=$(this).attr('class').split(' ');
			let idMembers=localStorage.getItem('id');
			let action='';
			let arr_value=[];let ajx_type='';
			if(cls.indexOf('booking_card')>-1){
				arr_value=[
					`idList=6825720a811d4c281604b176`,
					`idCardSource=${id}`,
					`keepFromSource=attachments,checklists,customFields,due,labels,start,stickers`,
					`dueComplete=false`,
					`idMembers=${idMembers}`,
					`name=${name} >> Test 2`,
					];
			    action="⚡ Booked";
			    ajx_type='POST';
			}
			else {
			    ajx_type='PUT';
				if(cls.indexOf('backlog_card')>-1){
					arr_value=[
						`idList=6825720a811d4c281604b173`,
						];
				    action="🎯 Backlog";
				}
				else if(cls.indexOf('complete_card')>-1){
					arr_value=[
					`idList=6825720a811d4c281604b174`,
					];
			        action="🎉 Completed";
				}
				else if(cls.indexOf('rebook_card')>-1){
					arr_value=[
					`idList=6825720a811d4c281604b176`,
					];
			        action="🎯 >> ⚡ Rebook";
				}
			}
		    $.ajax({
		        headers: {
		            "Accept": "*/*",
		            "Content-Type": "application/json"
		        },
		        url: `https://api.trello.com/1/cards${(ajx_type==='PUT'?('/'+id):'')}?${arr_value.join('&')}&key=${key}&token=${token}`,
		        type: ajx_type,
		        dataType: 'json',
		        async: false,
		        success: function(data) {
						if(ajx_type==='PUT'){
							$(`tr#${data.id}`).remove();
						}
					_send(`🌻 ${members.find(x=>x.id===idMembers).fullName}
						>> ${(new Date(data.dateLastActivity).toLocaleString())} >> ${action} card: <a href="${data.url}">${data.name}</a>`);
		        } 
		     });
		}
		// add id to tab div
		$.each($(`.tabs > div`), function(i, di){
			$(di).attr("id",lists.find(x=>x.name===$(di).text()).id);
			if(i===0) $(di).trigger('click');
		});
	}
});
