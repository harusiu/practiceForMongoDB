$(document).ready(function(){
    var url = "https://api.mlab.com/api/1/databases/bankforwebv1/collections/clientEntries?apiKey=WjKW6DB-id0Sh0auYn74RFzBMecR2Ugn";
    $('#add-entry').on('submit',function(e){
        e.preventDefault();
        var newClientName = $('#clientName').val();
        var newClientEmail = $('#clientEmail').val();
        var newAccountNumber = $('#accountNumber').val();
        var newAccountBalance = $('#accountBalance').val();

        $.ajax({
            url: url,
            data: JSON.stringify({
                "clientName" : newClientName,
                "clientEmail" : newClientEmail,
                "accountNumber" : newAccountNumber,
                "accountBalance" : newAccountBalance
            }),
            type: "POST",
            contentType: "application/json",
            success: function(response){
                var currentData = response;
                insertNewestEntry(currentData);
                clearInput();
                printNewestEntry(newClientName,newClientEmail,newAccountNumber,newAccountBalance);                
            },
            error: function(xhr, status, err){
                console.log(err);
            }
        });
    });

    $("#searchField").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $("tbody > tr").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });

    $(document).on('click','th',function(){
        var table = $(this).parents('table').eq(0);
        var rows = table.find('tr:gt(0)').toArray().sort(comparer($(this).index()));
        this.asc = !this.asc;
        if (!this.asc){rows = rows.reverse();}
        table.children('tbody').empty().html(rows);
    });
});

function comparer(index) {
    return function(a, b) {
        var valA = getCellValue(a, index), valB = getCellValue(b, index);
        return $.isNumeric(valA) && $.isNumeric(valB) ?
            valA - valB : valA.localeCompare(valB);
    };
}
function getCellValue(row, index){
    return $(row).children('td').eq(index).text();
}

function getEntries(){
    var urlForGetEntries = "https://api.mlab.com/api/1/databases/bankforwebv1/collections/clientEntries?apiKey=WjKW6DB-id0Sh0auYn74RFzBMecR2Ugn"
    $.ajax({
        url: urlForGetEntries
    }).done(function(data){
        var output = '<tr>';
        $.each(data, function(key, data){
            output += '<td id="'+data._id.$oid+'clientName" width="20%">'+data.clientName+'</td>';
            output += '<td id="'+data._id.$oid+'clientEmail" width="20%">'+data.clientEmail+'</td>';
            output += '<td id="'+data._id.$oid+'accountNumber" width="25%">'+data.accountNumber+'</td>';
            output += '<td id="'+data._id.$oid+'accountBalance" width="25%">'+data.accountBalance+'</td>';
            output += '<td width="10%"><div class="dropdown" style="display:inline-block"><button class="btn btn-primary btn-xs dropdown-toggle" type="button" data-toggle="dropdown">Edit';
            output += '<span class="caret"></span></button>';
            output += '<ul class="dropdown-menu">';
            output += '<li><a onclick="editClientName($(this).data(\'id\'))" data-id="'+data._id.$oid+'">Client Name</a><li>';
            output += '<li><a onclick="editClientEmail($(this).data(\'id\'))" data-id="'+data._id.$oid+'">Email</a><li>';
            output += '<li><a onclick="editAccountNumber($(this).data(\'id\'))" data-id="'+data._id.$oid+'">Account Number</a><li>';
            output += '<li><a onclick="editAccountBalance($(this).data(\'id\'))" data-id="'+data._id.$oid+'">Account Balance</a><li>';
            output += '<ul></div>';
            output += ' <button onclick="deleteEntry($(this).data(\'id\'))" data-id="'+data._id.$oid+'" class="btn btn-primary btn-xs" style="display:inline-block">Delete</button>';
            output += '</td></tr>';
        });
        $('tbody').append(output);
    });
}

function insertNewestEntry(currentData){
    var newestEntryInTable = '<tr>';
    newestEntryInTable += '<td id="'+currentData._id.$oid+'clientName" width="20%">'+currentData.clientName+'</td>';
    newestEntryInTable += '<td id="'+currentData._id.$oid+'clientEmail" width="20%">'+currentData.clientEmail+'</td>';
    newestEntryInTable += '<td id="'+currentData._id.$oid+'accountNumber" width="25%">'+currentData.accountNumber+'</td>';
    newestEntryInTable += '<td id="'+currentData._id.$oid+'accountBalance" width="25%">'+currentData.accountBalance+'</td>';
    newestEntryInTable += '<td width="10%"><div class="dropdown" style="display:inline-block"><button class="btn btn-primary btn-xs dropdown-toggle" type="button" data-toggle="dropdown">Edit';
    newestEntryInTable += '<span class="caret"></span></button>';
    newestEntryInTable += '<ul class="dropdown-menu">';
    newestEntryInTable += '<li><a onclick="editClientName($(this).data(\'id\'))" data-id="'+currentData._id.$oid+'">Client Name</a><li>';
    newestEntryInTable += '<li><a onclick="editClientEmail($(this).data(\'id\'))" data-id="'+currentData._id.$oid+'">Email</a><li>';
    newestEntryInTable += '<li><a onclick="editAccountNumber($(this).data(\'id\'))" data-id="'+currentData._id.$oid+'">Account Number</a><li>';
    newestEntryInTable += '<li><a onclick="editAccountBalance($(this).data(\'id\'))" data-id="'+currentData._id.$oid+'">Account Balance</a><li>';
    newestEntryInTable += '<ul></div>';
    newestEntryInTable += ' <button onclick="deleteEntry($(this).data(\'id\'))" data-id="'+currentData._id.$oid+'" class="btn btn-primary btn-xs" style="display:inline-block">Delete</button>';
    newestEntryInTable += '</td></tr>';
    $('tbody').prepend(newestEntryInTable);
}

function clearInput(){
    $('#clientName').val('');
    $('#clientEmail').val('');
    $('#accountNumber').val('');
    $('#accountBalance').val('');
}

function printNewestEntry(newestClientName,newestClientEmail,newestAccountNumber,newestAccountBalance){
    $('#newestEntryHeader').replaceWith(function(e){
        return ('<h3 id="newestEntryHeader" style="color:#459EB7">Newest Entry</h3>');
    });
    $('#lbNewClientName').replaceWith(function(e){
        return ('<label id="lbNewClientName" class="newEntryLabel">'+newestClientName+'</label>');
    });
    $('#lbNewClientEmail').replaceWith(function(e){
        return ('<label id="lbNewClientEmail" class="newEntryLabel">'+newestClientEmail+'</label>');
    });
    $('#lbNewAccountNumber').replaceWith(function(e){
        return ('<label id="lbNewAccountNumber" class="newEntryLabel">'+newestAccountNumber+'</label>');
    });
    $('#lbNewAccountBalance').replaceWith(function(e){
        return ('<label id="lbNewAccountBalance" class="newEntryLabel">'+newestAccountBalance+'</label>');
    });
}

function editClientName(id){
    $.ajax({
        url: ("https://api.mlab.com/api/1/databases/bankforwebv1/collections/clientEntries/"+id+"?apiKey=WjKW6DB-id0Sh0auYn74RFzBMecR2Ugn"),
        success: function(response){
            var currentData = response;
            $('#'+id+'clientName').replaceWith(function(e){
                return ('<input type="text" id="'+id+'EditedClientName" value="'+currentData.clientName+'"><button onclick="saveEditedClientName($(this).data(\'id\'))" data-id="'+currentData._id.$oid+'" id="'+id+'EditClientNameButton" class="btn btn-primary btn-xs">Save</button>');
            });
        }
    });  
}

function saveEditedClientName(id){
    $.ajax({
        url: ("https://api.mlab.com/api/1/databases/bankforwebv1/collections/clientEntries/"+id+"?apiKey=WjKW6DB-id0Sh0auYn74RFzBMecR2Ugn"),
        data: JSON.stringify( { "$set" : { "clientName" : $('#'+id+'EditedClientName').val() } } ),
        type: "PUT",
        contentType: "application/json",
        success: function(response){
            var currentData = response;
            $('#'+id+'EditedClientName').replaceWith(function(e){
                return ('<td id="'+currentData._id.$oid+'clientName" width="20%">'+currentData.clientName+'</td>');
            });
            $('#'+id+'EditClientNameButton').remove();
        },
        error: function(xhr, status, err){
            console.log(err);
        }
    });  
}

function editClientEmail(id){
    $.ajax({
        url: ("https://api.mlab.com/api/1/databases/bankforwebv1/collections/clientEntries/"+id+"?apiKey=WjKW6DB-id0Sh0auYn74RFzBMecR2Ugn"),
        success: function(response){
            var currentData = response;
            $('#'+id+'clientEmail').replaceWith(function(e){
                return ('<input type="text" id="'+id+'EditedClientEmail" value="'+currentData.clientEmail+'"><button onclick="saveEditedClientEmail($(this).data(\'id\'))" data-id="'+currentData._id.$oid+'" id="'+id+'EditClientEmailButton" class="btn btn-primary btn-xs">Save</button>');
            });
        }
    });  
}

function saveEditedClientEmail(id){
    $.ajax({
        url: ("https://api.mlab.com/api/1/databases/bankforwebv1/collections/clientEntries/"+id+"?apiKey=WjKW6DB-id0Sh0auYn74RFzBMecR2Ugn"),
        data: JSON.stringify( { "$set" : { "clientEmail" : $('#'+id+'EditedClientEmail').val() } } ),
        type: "PUT",
        contentType: "application/json",
        success: function(response){
            var currentData = response;
            $('#'+id+'EditedClientEmail').replaceWith(function(e){
                return ('<td id="'+currentData._id.$oid+'clientEmail" width="20%">'+currentData.clientEmail+'</td>');
            });
            $('#'+id+'EditClientEmailButton').remove();
        },
        error: function(xhr, status, err){
            console.log(err);
        }
    });  
}

function editAccountNumber(id){
    $.ajax({
        url: ("https://api.mlab.com/api/1/databases/bankforwebv1/collections/clientEntries/"+id+"?apiKey=WjKW6DB-id0Sh0auYn74RFzBMecR2Ugn"),
        success: function(response){
            var currentData = response;
            $('#'+id+'accountNumber').replaceWith(function(e){
                return ('<input type="text" id="'+id+'EditedAccountNumber" value="'+currentData.accountNumber+'"><button onclick="saveEditedAccountNumber($(this).data(\'id\'))" data-id="'+currentData._id.$oid+'" id="'+id+'EditAccountNumberButton" class="btn btn-primary btn-xs">Save</button>');
            });
        }
    });  
}

function saveEditedAccountNumber(id){
    $.ajax({
        url: ("https://api.mlab.com/api/1/databases/bankforwebv1/collections/clientEntries/"+id+"?apiKey=WjKW6DB-id0Sh0auYn74RFzBMecR2Ugn"),
        data: JSON.stringify( { "$set" : { "accountNumber" : $('#'+id+'EditedAccountNumber').val() } } ),
        type: "PUT",
        contentType: "application/json",
        success: function(response){
            var currentData = response;
            $('#'+id+'EditedAccountNumber').replaceWith(function(e){
                return ('<td id="'+currentData._id.$oid+'accountNumber" width="20%">'+currentData.accountNumber+'</td>');
            });
            $('#'+id+'EditAccountNumberButton').remove();
        },
        error: function(xhr, status, err){
            console.log(err);
        }
    });  
}

function editAccountBalance(id){
    $.ajax({
        url: ("https://api.mlab.com/api/1/databases/bankforwebv1/collections/clientEntries/"+id+"?apiKey=WjKW6DB-id0Sh0auYn74RFzBMecR2Ugn"),
        success: function(response){
            var currentData = response;
            $('#'+id+'accountBalance').replaceWith(function(e){
                return ('<input type="text" id="'+id+'EditedAccountBalance" value="'+currentData.accountBalance+'"><button onclick="saveEditedAccountBalance($(this).data(\'id\'))" data-id="'+currentData._id.$oid+'" id="'+id+'EditAccountBalanceButton" class="btn btn-primary btn-xs">Save</button>');
            });
        }
    });  
}

function saveEditedAccountBalance(id){
    $.ajax({
        url: ("https://api.mlab.com/api/1/databases/bankforwebv1/collections/clientEntries/"+id+"?apiKey=WjKW6DB-id0Sh0auYn74RFzBMecR2Ugn"),
        data: JSON.stringify( { "$set" : { "accountBalance" : $('#'+id+'EditedAccountBalance').val() } } ),
        type: "PUT",
        contentType: "application/json",
        success: function(response){
            var currentData = response;
            $('#'+id+'EditedAccountBalance').replaceWith(function(e){
                return ('<td id="'+currentData._id.$oid+'accountBalance" width="20%">'+currentData.accountBalance+'</td>');
            });
            $('#'+id+'EditAccountBalanceButton').remove();
        },
        error: function(xhr, status, err){
            console.log(err);
        }
    });  
}

function deleteEntry(id){
    var msg;
    var flag = confirm("Data will be delete from the database, are you sure?");
    if (flag == true) {
        $.ajax({
            url: ("https://api.mlab.com/api/1/databases/bankforwebv1/collections/clientEntries/"+id+"?apiKey=WjKW6DB-id0Sh0auYn74RFzBMecR2Ugn"),
            type: "DELETE",
            async: true,
            timeout: 10000,
            success: function (response) {
                $('#'+id+'clientName').closest('tr').remove();
                $('#'+id+'clientName').remove();
                $('#'+id+'clientEmail').remove();
                $('#'+id+'accountNumber').remove();
                $('#'+id+'accountBalance').remove();
            },
            error: function (xhr, status, err) {
                console.log(err);
            }
        });
    } else {}
}