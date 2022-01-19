(function () {
    // console.log("oh,i am here",$);
    var curPlayer = "player1";
    var button = $("button");
    button.hide();
    var win = false;
   

    // 1.Let's keep track of whose turn it is (only 2 options: either player1 or player2)

    function switchPlayer() {
        if (curPlayer === "player1") {
            curPlayer = "player2";
        } else {
            curPlayer = "player1";
        }
    }

    // 2.Recognize which column got clicked

    $(".column").on("click", function game(e) {
        var col = $(e.currentTarget);
        // console.log(col);
        var slotsInCol = col.children(); // 6 chilren in column;

        // loop BACKWARD over slots because we want to check THE LAST INDEX for a free spot first as that is where our chip would drop if free

        for (var i = slotsInCol.length - 1; i >= 0; i--) {
            var freeSlot =
                !slotsInCol.eq(i).hasClass("player1") &&
                !slotsInCol.eq(i).hasClass("player2");

            if (freeSlot) {
                // found the target-freeslot should apply current player's class to free slot and EXIT loop
                // console.log(slotsInCol.eq(i));
                slotsInCol.eq(i).children().addClass("fall");
                slotsInCol.eq(i).addClass(curPlayer);
                break; // if without break here, then it will loop over until the whole column full
            }
        }
        if (i === -1) {
            console.log("full");
            // ignore the click, and dun switch player.
            return;
        }

        // 3.To check is there "Connect Four"?

        //check is there a victory in column / in row / in diagonal? 

        var slotsInRow = $(".row" + i);
        //check for victory

        if (checkForVictory(slotsInCol).win) {
            var message = "Congrats! Column VICTORY";
            checkForVictory(slotsInCol).winSlots.children().addClass("win"); // to highlight the connecting four children
            win = true; // to invoke the button pop up
        } else if (checkForVictory(slotsInRow).win) {
            var message = "Congrats! Row VICTORY";
            checkForVictory(slotsInRow).winSlots.children().addClass("win"); // to highlight the connecting four children
            win = true;
        }
        var diags = [
            ".s0, .s7, .s14, .s21",
            ".s1, .s8, .s15, .s22",
            ".s2, .s9, .s16, .s23",
            ".s3, .s8, .s13, .s18",
            ".s4, .s9, .s14, .s19",
            ".s5, .s10, .s15, .s20",
            ".s6, .s13, .s20, .s27",
            ".s7, .s14, .s21, .s28",
            ".s8, .s15, .s22, .s29",
            ".s9, .s14, .s19, .s24",
            ".s10, .s15, .s20, .s25",
            ".s11, .s16, .s21, .s26",
            ".s12, .s19, .s26, .s33",
            ".s13, .s20, .s27, .s34",
            ".s14, .s21, .s28, .s35",
            ".s15, .s20, .s25, .s30",
            ".s16, .s21, .s26, .s31",
            ".s18, .s25, .s32, .s39",
            ".s19, .s26, .s33, .s40",
            ".s20, .s27, .s34, .s41",
            ".s21, .s26, .s31, .s36",
            ".s22, .s27, .s32, .s37",
            ".s17, .s22, .s27, .s32",
            ".s23, .s28, .s33, .s38",
        ];

        for (var k = 0; k < diags.length; k++) {
            if (checkForVictory($(diags[k])).win) {
                var message = "Congrats! Diagonal VICTORY";
                checkForVictory($(diags[k]))
                    .winSlots.children()
                    .addClass("win");
                win = true;
                break;
            }
        }


        
        if (win) {
            $(".message").html(message);
            button.show();
            $(".column").off(); // !! to stop player click 

            // if win, click button and reset everything

            button.on("click", function () {
                $(".slot").removeClass("player1");
                $(".slot").removeClass("player2");
                $(".slot").children().removeClass("fall");
                $(".slot").children().removeClass("win");
                $(".message").html("Welcome To The Game");
                button.hide();
                button.off();
                win = false;
                $(".column").on("click", game);
            });
        }

        switchPlayer();

    });

    //function for win check

    function checkForVictory(slots) {
        var count = 0;
        for (var i = 0; i < slots.length; i++) {
            // console.log(slots.eq(i).hasClass(currPlayer));
            if (slots.eq(i).hasClass(curPlayer)) {
                // console.log("count", count);
                count++;
                if (count === 4) {
                    return { win: true, winSlots: slots.slice(i - 3, i + 1) }; // win and find which four slots are connecting, they need to be highlight
                }
            } else {
                // console.log("empty", count);
                count = 0;
            }
        }
        return { win: false, winSlots: null };
    }
})();
