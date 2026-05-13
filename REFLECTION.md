# REFLECTION.md — Бие даалт 14

## 1. Аль assertion хамгийн их үнэ цэнэтэй санагдсан вэ? Яагаад?

Хамгийн их үнэ цэнэтэй assertion нь **chain-д суурилсан id шалгалт** байсан. `POST /api/books` request 201-тэй амжилттай буцах ч гэсэн, буцсан `id`-г environment variable-д хадгалаад, дараагийн `PUT` болон `DELETE` request-уудад ашиглах нь бодит integration тестийг хэрэгжүүлж байгаа юм. Зөвхөн status code шалгахад хангалттай биш — буцсан data нь дараагийн алхамд ашиглагдах боломжтой эсэх нь API-ийн "contract"-ийн голын хэсэг. Хэрэв `id` field-ийн нэр өөрчлөгдвөл (жишээ нь `bookId` болвол), энэ chain бүхэлдээ эвдэрч, алдаа шууд илрэх болно.

## 2. Negative test-ийн жишээгээ дэлгэрэнгүй тайлбарла

`POST /api/books` руу `title` талбаргүй body явуулах negative test нь тодорхой алдааг шалгадаг: сервер **validation-ийг зохистой хийж байна уу?** Хэрэв сервер 201 буцааж, `title` нь `null` болон хадгалагдвал — энэ нь data corruption. 400 буцааж, `error` field-д `"title"` гэсэн утга байвал хэрэглэгчид тодорхой мессеж өгч байна гэсэн үг. Энэ тест нь "happy path"-аас илүү практик утгатай — production-д хэрэглэгч алдаатай input явуулах нь хэвийн үзэгдэл.

## 3. Postman дотор амжилттай ажиллаж байсан тест Newman-д fail болсон уу?

Тийм — анхны туршилтад `existingBookId` environment variable-г Postman-д гараар тохируулсан байсан тул Postman дотор `GET /api/books/{{existingBookId}}` зөв ажиллаж байлаа. Гэтэл Newman ажиллуулахад `env.dev.json`-д тухайн variable-ийн утгыг дутуу тохируулсан байсан тул 404 алдаа гарсан. Шийдэл: `GET all books` request-ийн test script-д `pm.environment.set('existingBookId', books[0].id)` нэмж, chain-г бүрэн автоматжуулсан. Энэ туршлагаас гарсан дүгнэлт: Newman-д ажиллуулахаас өмнө environment file бүрэн бэлтгэгдсэн эсэхийг шалгах хэрэгтэй.

## 4. Token болон secret-ыг хэрхэн зохицуулсан вэ?

Энэ API auth шаардахгүй тул token байхгүй. Гэсэн ч env file-ийн зохицуулалтын зарчмыг дагасан: `env.dev.json`-д бодит `baseUrl` (`http://localhost:3000`) тохируулсан, `env.ci.json`-д мөн адил. Хэрэв token шаардах API байсан бол `REPLACE_THIS_WITH_REAL_TOKEN` placeholder ашиглаж, README-д тайлбарлаж, `.gitignore`-д бодит token-тэй файлыг оруулахгүй байх байсан. GitHub Secrets-ийг ашиглан CI workflow-д environment variable-г inject хийх нь хамгийн зохистой арга юм.

## 5. API өөрчлөгдвөл collection-ийн аль хэсэг хамгийн их эвдрэх вэ?

**Chain-д суурилсан тестүүд** хамгийн эмзэг. Жишээ нь, `POST /api/books`-ын response-д `data.id` field `data.bookId` болж өөрчлөгдвөл, `pm.environment.set('newBookId', d.data.id)` нь `undefined` хадгалж, дараагийн `PUT` болон `DELETE` request 404 буцаана. Мөн schema assertion-ууд (`pm.expect(d).to.have.property('id')`) бүгд fail болно. Эмзэг байдлыг бууруулахын тулд: (1) schema-г тусдаа JSON Schema объектоор баталгаажуулах, (2) chain variable-г алдаа гарвал тодорхой мессежтэйгээр шалгах, (3) API-ийн breaking change-ийг versioning-аар зохицуулах (`/api/v1/books`) нь зөв арга барил.
