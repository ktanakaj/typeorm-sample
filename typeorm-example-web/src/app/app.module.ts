/**
 * アプリのルートモジュール。
 * @module ./app/app.module
 */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler, Injectable, LOCALE_ID } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { CollapseModule, ModalModule, PaginationModule } from 'ngx-bootstrap';

import browserHelper from './core/browser-helper';
import { AppComponent } from './app.component';
import { BlogComponent } from './blogs/blog.component';
import { ArticleComponent } from './articles/article.component';

/** ルート定義 */
const appRoutes: Routes = [
	{ path: '', pathMatch: 'full', component: BlogComponent },
	{ path: 'blogs/:blogId/articles', component: ArticleComponent },
	{ path: '**', redirectTo: '/' }
];

/**
 * デフォルトのエラーハンドラー。
 */
@Injectable()
export class DefaultErrorHandler implements ErrorHandler {
	/**
	 * サービスをDIしてハンドラーを生成する。
	 * @param translate 国際化サービス。
	 */
	constructor(private translate?: TranslateService) { }

	/**
	 * エラーを受け取る。
	 * @param error エラー情報。
	 */
	handleError(error: Error | any): void {
		// ※ Promiseの中で発生したエラーの場合、ラップされてくるので、元の奴を取り出す
		if (error && error.rejection) {
			error = error.rejection;
		}
		// TODO: エラーの種類ごとに切り替え
		const msgId = 'ERROR.FATAL';
		console.error(error);
		this.translate.get(msgId).subscribe((res: string) => {
			window.alert(res);
		});
	}
}

/**
 * アプリのルートモジュールクラス。
 */
@NgModule({
	declarations: [
		AppComponent,
		BlogComponent,
		ArticleComponent,
	],
	imports: [
		BrowserModule,
		FormsModule,
		HttpClientModule,
		RouterModule.forRoot(appRoutes),
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: (http: HttpClient) => new TranslateHttpLoader(http, './assets/i18n/'),
				deps: [HttpClient]
			}
		}),
		CollapseModule.forRoot(),
		ModalModule.forRoot(),
		PaginationModule.forRoot(),
	],
	providers: [
		{ provide: LOCALE_ID, useValue: browserHelper.getLocale() },
		{ provide: ErrorHandler, useClass: DefaultErrorHandler },
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
