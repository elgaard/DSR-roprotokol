Alter table Error_Trip DROP column TripMember0;

Alter table Error_Trip DROP column TripMember0;
Alter table Error_Trip DROP column TripMember1;
Alter table Error_Trip DROP column TripMember2;
Alter table Error_Trip DROP column TripMember3;
Alter table Error_Trip DROP column TripMember4;
Alter table Error_Trip DROP column TripMember5;
Alter table Error_Trip DROP column TripMember6;
Alter table Error_Trip DROP column TripMember7;
Alter table Error_Trip DROP column TripMember8;
Alter table Error_Trip DROP column TripMember9;

Alter table Error_Trip DROP column Season;
Alter table Error_Trip DROP column Boat;

Alter table Error_TripMember DROP column Initials;
Alter table Error_TripMember DROP column EditDate;
Alter table Error_TripMember DROP column CreatedDate;

ALTER TABLE Boat ADD COLUMN placement_aisle INT;
ALTER TABLE Boat ADD COLUMN placement_level INT;
ALTER TABLE Boat ADD COLUMN placement_row INT;
ALTER TABLE Boat ADD COLUMN placement_side CHAR(6);


ALTER TABLE TripType ADD COLUMN tripstat_name  CHAR(20);

UPDATE TripType SET tripstat_name="Lokal" WHERE id=1;
UPDATE TripType SET tripstat_name="Tastet" WHERE id=2;
UPDATE TripType SET tripstat_name="INKA" WHERE id=4;
UPDATE TripType SET tripstat_name="POP/SPP" WHERE id=7;
UPDATE TripType SET tripstat_name="POP/SPP" WHERE id=14;

UPDATE TripType SET tripstat_name="Langtur" WHERE id=3;
UPDATE TripType SET tripstat_name="Instruktion" WHERE id=5;
UPDATE TripType SET tripstat_name="Racerkanin" WHERE id=8;
UPDATE TripType SET tripstat_name="Teknik+-Tur" WHERE id=9;
UPDATE TripType SET tripstat_name="Teknik+-Tur" WHERE id=13;
UPDATE TripType SET tripstat_name="Teknik+-Tur" WHERE id=15;
UPDATE TripType SET tripstat_name="Teknik+-Tur" WHERE id=16;

UPDATE TripType SET tripstat_name="Styrmandsinst" WHERE id=11;
UPDATE TripType SET tripstat_name="outr/scull inst" WHERE id=10;
UPDATE TripType SET tripstat_name="Udst/8GP" WHERE id=6;
UPDATE TripType SET tripstat_name="Udst/8GP" WHERE id=12;
