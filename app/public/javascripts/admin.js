$("#tripos-part-select").on("change", function () {
    let selectedValue = $(this).val();
    $('#subjects > article > div').each(function () {
        $(this).data('part') === selectedValue ? $(this).removeClass('d-none') : $(this).addClass('d-none');
    });
    selectedValue === "" ? $('#subjects > p').removeClass('d-none') : $('#subjects > p').addClass('d-none');
});