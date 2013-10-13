USE BayGUI
GO
--SELECT * FROM BoxData

DECLARE myCursor CURSOR FOR SELECT id, boxNo, boxSpec, boxState, boxType, boxWeight, fromPort, toPort, bayCellNo FROM BoxData
DECLARE @id int, @boxNo varchar(32), @boxSpec varchar(2), @boxState varchar(1), @boxType varchar(2),
        @boxWeight decimal(18, 2), @fromPort nvarchar(32), @toPort nvarchar(32), @bayCellNo varchar(6)
OPEN myCursor
PRINT N'['
FETCH NEXT FROM myCursor INTO @id, @boxNo, @boxSpec, @boxState, @boxType, @boxWeight, @fromPort, @toPort, @bayCellNo
WHILE @@FETCH_STATUS = 0
BEGIN
    --UPDATE BoxData SET bayCellNo = NULL WHERE id = @id AND RAND() > 0.5
    PRINT N'    { "id": ' + CAST(@id AS nvarchar) +
        N', "boxNo": "' + @boxNo +
        N'", "boxSpec": "' + @boxSpec +
        N'", "boxState": "' + @boxState +
        N'", "boxType": "' + @boxType +
        N'", "boxWeight": ' + CAST(@boxWeight AS nvarchar) +
        N', "fromPort": "' + @fromPort +
        N'", "toPort": "' + @toPort +
        N'", "bayCellNo": "' + N'' + N'" },'
    FETCH NEXT FROM myCursor INTO @id, @boxNo, @boxSpec, @boxState, @boxType, @boxWeight, @fromPort, @toPort, @bayCellNo
END
PRINT N']'
CLOSE myCursor
DEALLOCATE myCursor


